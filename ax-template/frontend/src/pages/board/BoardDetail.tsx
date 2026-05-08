import { Link, useParams, useNavigate } from 'react-router-dom';
import { useBoardDetail } from './hooks';
import { boardApi } from './api';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pencil, Trash2, Download, Eye, Calendar } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { board, loading } = useBoardDetail(id ? Number(id) : null);

  const handleDelete = async () => {
    if (!board || !window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await boardApi.delete(board.board_id);
      navigate('/boards');
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center text-muted-foreground">
        불러오는 중...
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex h-60 flex-col items-center justify-center gap-3 text-muted-foreground">
        <p>게시글을 찾을 수 없습니다</p>
        <Link to="/boards" className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Back */}
      <div>
        <Breadcrumb items={[{ label: '커뮤니티' }, { label: '게시판', path: '/boards' }, { label: '상세' }]} />
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {board.notice_yn === 'y' && (
            <span className="mt-1 inline-flex items-center rounded bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5">공지</span>
          )}
          <h1 className="text-2xl font-bold leading-tight tracking-tight">{board.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {board.wdate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            {board.file_count}
          </span>
        </div>
      </div>

      <Separator />

      {/* Attachments — 내용 위 */}
      {board.files && board.files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground">첨부파일 ({board.files.length})</h3>
          <div className="rounded border overflow-hidden">
            {board.files.map((file) => (
              <div key={file.file_id} className="flex items-center gap-3 px-3 py-2.5 border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/5 text-primary">
                  <Download className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium flex-1 truncate">{file.file_name}</span>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {file.file_size >= 1048576
                    ? `${(file.file_size / 1048576).toFixed(1)} MB`
                    : `${(file.file_size / 1024).toFixed(0)} KB`
                  }
                </span>
                <button className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Content */}
      <div
        className="prose prose-sm max-w-none prose-headings:font-semibold prose-p:text-foreground/85 prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: board.content }}
      />

      {/* Actions */}
      <Separator />
      <div className="flex items-center justify-between">
        <Link to="/boards" className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted">
          목록
        </Link>
        <div className="flex gap-2">
          <Link
            to={`/boards/${board.board_id}/edit`}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" />
            수정
          </Link>
          <Button variant="outline" size="default" className="gap-1.5 text-destructive hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" />
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
