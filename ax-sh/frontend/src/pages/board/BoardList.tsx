import { Link } from 'react-router-dom';
import { useBoardList } from './hooks';
import SearchForm from '@/components/common/SearchForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Eye, Paperclip, Plus } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function BoardList() {
  const { list, pagination, loading, search, goToPage } = useBoardList();

  const pageNumbers = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Breadcrumb items={[{ label: '커뮤니티' }, { label: '게시판' }]} />
          <h1 className="text-2xl font-semibold tracking-tight">게시판</h1>
        </div>
        <Link
          to="/boards/new"
          className="inline-flex h-9 items-center gap-1.5 rounded bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          글쓰기
        </Link>
      </div>

      {/* Search — 좌측 정렬 */}
      <div className="mb-4">
        <SearchForm onSearch={search} />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/50">
              <TableHead className="w-[60px] text-center text-xs font-medium">번호</TableHead>
              <TableHead className="text-xs font-medium">제목</TableHead>
              <TableHead className="w-[100px] text-center text-xs font-medium">작성자</TableHead>
              <TableHead className="w-[100px] text-center text-xs font-medium">작성일</TableHead>
              <TableHead className="w-[70px] text-center text-xs font-medium">조회</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                  게시글이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              list.map((board) => (
                <TableRow key={board.board_id} className="group">
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {board.notice_yn === 'y' ? (
                      <span className="inline-flex items-center rounded bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5">공지</span>
                    ) : (
                      board.board_id
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/boards/${board.board_id}`}
                      className="inline-flex items-center gap-2 text-xs font-medium transition-colors group-hover:text-primary"
                    >
                      <span className="line-clamp-1">{board.title}</span>
                      {board.file_count > 0 && (
                        <Paperclip className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {board.created_by}
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {board.created_at}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {board.view_count}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(Math.max(1, pagination.page - 1))}
                  className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {pageNumbers.map((num) => (
                <PaginationItem key={num}>
                  <PaginationLink
                    onClick={() => goToPage(num)}
                    isActive={num === pagination.page}
                    className="cursor-pointer"
                  >
                    {num}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => goToPage(Math.min(pagination.totalPages, pagination.page + 1))}
                  className={pagination.page >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
