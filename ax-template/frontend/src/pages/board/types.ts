import { FileInfo } from "@/pages/file";

/** 검색 유형 */
export type SearchType = 'title' | 'content' | 'title_content';

/** 게시글 목록 조회 파라미터 */
export interface BoardListParams {
  page: number;
  pageSize: number;
  sField?: SearchType;
  sWord?: string;
  sdate?: string;
  edate?: string;
}

/** 게시글 등록/수정 폼 데이터 */
export interface BoardFormData {
  title: string;
  content: string;
  notice_yn: string;       // 공지 상단고정 (y/n)
  status: string;          // 사용여부 (y/n)
  files?: number[];  // 첨부파일 ID 목록
}

/** 게시글 목록 아이템 */
export interface BoardItem {
  board_id: number;
  title: string;
  content: string;
  notice_yn: string;
  status: string;
  wdate: string;
  udate: string;
  view_count: number;
  file_count: number;      // 첨부파일 수
}

/** 게시글 상세 */
export interface BoardDetail extends BoardItem {
  files: FileItem[];       // 첨부파일 목록
}

/** 첨부파일 */
export type FileItem = FileInfo;

/** 페이징 정보 */
export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
