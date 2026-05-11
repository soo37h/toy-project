import { http, HttpResponse, delay } from "msw";
import { mockBoards } from "./data/boards";
import { mockUsers, mockToken } from "./data/auth";

export const handlers = [
	// ======================== 게시판 ========================

	/** 목록 조회 (검색유형 + 키워드 + 기간 + 페이징) */
	http.get("/api/boards", async ({ request }) => {
		await delay(300);
		const url = new URL(request.url);
		const page = Number(url.searchParams.get("page") || "1");
		const pageSize = Number(url.searchParams.get("pageSize") || "10");
		const searchType = url.searchParams.get("searchType") || "";
		const keyword = url.searchParams.get("keyword") || "";
		const startDate = url.searchParams.get("startDate") || "";
		const endDate = url.searchParams.get("endDate") || "";

		let filtered = [...mockBoards];

		// 검색 필터
		if (keyword) {
			filtered = filtered.filter((b) => {
				switch (searchType) {
					case "title":
						return b.title.includes(keyword);
					case "content":
						return b.content.includes(keyword);
					case "all":
					default:
						return (
							b.title.includes(keyword) ||
							b.content.includes(keyword)
						);
				}
			});
		}

		// 기간 필터
		if (startDate && endDate) {
			filtered = filtered.filter(
				(b) => b.wdate >= startDate && b.wdate <= endDate,
			);
		}

		// 사용중인 것만 (status='y')
		filtered = filtered.filter((b) => b.status === "y");

		// 공지 먼저, 그 다음 최신순
		filtered.sort((a, b) => {
			if (a.notice_yn !== b.notice_yn)
				return a.notice_yn === "y" ? -1 : 1;
			return b.board_id - a.board_id;
		});

		const totalCount = filtered.length;
		const start = (page - 1) * pageSize;
		const list = filtered
			.slice(start, start + pageSize)
			.map(({ content: _content, files, ...item }) => ({
				...item,
				file_count: files?.length || 0,
			}));

		return HttpResponse.json({
			success: true,
			data: {
				list,
				pagination: {
					page,
					pageSize,
					totalCount,
					totalPages: Math.ceil(totalCount / pageSize),
				},
			},
		});
	}),

	/** 상세 조회 (조회수 증가) */
	http.get("/api/boards/:id", async ({ params }) => {
		await delay(200);
		const board = mockBoards.find((b) => b.board_id === Number(params.id));
		if (!board) {
			return HttpResponse.json(
				{
					success: false,
					message: "게시글을 찾을 수 없습니다.",
					code: "NOT_FOUND",
				},
				{ status: 404 },
			);
		}
		board.view_count += 1;
		return HttpResponse.json({ success: true, data: board });
	}),

	/** 등록 */
	http.post("/api/boards", async ({ request }) => {
		await delay(300);
		const body = (await request.json()) as Record<string, unknown>;
		const newBoard = {
			board_id: mockBoards.length + 1,
			title: body.title as string,
			content: body.content as string,
			notice_yn: (body.notice_yn as string) || "n",
			status: (body.status as string) || "y",
			wdate: new Date().toISOString().replace("T", " ").substring(0, 19),
			udate: new Date().toISOString().replace("T", " ").substring(0, 19),
			view_count: 0,
			file_count: 0,
			files: [],
		};
		mockBoards.push(newBoard);
		return HttpResponse.json({ success: true, data: newBoard });
	}),

	/** 수정 */
	http.put("/api/boards/:id", async ({ params, request }) => {
		await delay(300);
		const board = mockBoards.find((b) => b.board_id === Number(params.id));
		if (!board) {
			return HttpResponse.json(
				{
					success: false,
					message: "게시글을 찾을 수 없습니다.",
					code: "NOT_FOUND",
				},
				{ status: 404 },
			);
		}
		const body = (await request.json()) as Record<string, unknown>;
		Object.assign(board, {
			title: body.title,
			content: body.content,
			notice_yn: body.notice_yn,
			status: body.status,
			updated_at: new Date()
				.toISOString()
				.replace("T", " ")
				.substring(0, 19),
		});
		return HttpResponse.json({ success: true, data: board });
	}),

	/** 삭제 (소프트 삭제) */
	http.delete("/api/boards/:id", async ({ params }) => {
		await delay(200);
		const board = mockBoards.find((b) => b.board_id === Number(params.id));
		if (!board) {
			return HttpResponse.json(
				{
					success: false,
					message: "게시글을 찾을 수 없습니다.",
					code: "NOT_FOUND",
				},
				{ status: 404 },
			);
		}
		board.status = "d";
		return HttpResponse.json({ success: true, data: null });
	}),

	// ======================== 인증 ========================

	/** 로그인 */
	http.post("/api/auth/login", async ({ request }) => {
		await delay(300);
		const body = (await request.json()) as {
			email: string;
			password: string;
		};
		const user = mockUsers.find(
			(u) => u.email === body.email && u.password === body.password,
		);
		if (!user) {
			return HttpResponse.json(
				{
					success: false,
					message: "이메일 또는 비밀번호가 올바르지 않습니다.",
					code: "AUTH_FAILED",
				},
				{ status: 401 },
			);
		}
		const { password: _pw, ...userInfo } = user;
		return HttpResponse.json({
			success: true,
			data: { token: mockToken, user: userInfo },
		});
	}),

	/** 회원가입 */
	http.post("/api/auth/signup", async ({ request }) => {
		await delay(300);
		const body = (await request.json()) as {
			email: string;
			password: string;
			nickname: string;
		};
		if (mockUsers.some((u) => u.email === body.email)) {
			return HttpResponse.json(
				{
					success: false,
					message: "이미 사용 중인 이메일입니다.",
					code: "DUPLICATE_EMAIL",
				},
				{ status: 400 },
			);
		}
		return HttpResponse.json({ success: true, data: null });
	}),

	/** 내 정보 */
	http.get("/api/auth/me", async () => {
		await delay(200);
		const { password: _pw, ...userInfo } = mockUsers[1];
		return HttpResponse.json({ success: true, data: userInfo });
	}),

	// ======================== 파일 ========================

	/** 에디터 이미지 업로드 (Mock: 더미 URL 반환) */
	http.post("/api/files/editor-image", async () => {
		await delay(500);
		return HttpResponse.json({
			success: true,
			data: { url: "https://placehold.co/600x400?text=Uploaded+Image" },
		});
	}),

	/** 첨부파일 업로드 (Mock: 더미 파일정보 반환) */
	http.post("/api/files/attachments", async () => {
		await delay(500);
		return HttpResponse.json({
			success: true,
			data: [
				{
					file_id: Date.now(),
					original_name: "mock_file.pdf",
					file_size: 1024000,
					file_type: "application/pdf",
					created_at: new Date().toISOString().split("T")[0],
				},
			],
		});
	}),
];
