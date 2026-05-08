import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Editor } from '@tinymce/tinymce-react';
import { boardApi } from './api';
import { useBoardDetail } from './hooks';
import { fileApi } from '@/pages/file';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import client from '@/lib/client';
import type { FileItem } from './types';

export default function BoardForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { board } = useBoardDetail(isEdit ? Number(id) : null);
  const editorRef = useRef<unknown>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noticeYn, setNoticeYn] = useState(false);
  const [statusYn, setStatusYn] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setContent(board.content);
      setNoticeYn(board.notice_yn === 'y');
      setStatusYn(board.status === 'y');
      if (board.files) setFiles(board.files);
    }
  }, [board]);

  // Dropzone
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const res = await fileApi.uploadAttachments(acceptedFiles);
      setFiles((prev) => [...prev, ...res.data]);
    } catch {
      alert('파일 업로드에 실패했습니다.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  const removeFile = (fileId: number) => {
    setFiles((prev) => prev.filter((f) => f.file_id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        title,
        content,
        notice_yn: noticeYn ? 'y' : 'n',
        status: statusYn ? 'y' : 'n',
        attachments: files.map((f) => f.file_id),
      };

      if (isEdit) {
        await boardApi.update(Number(id), data);
      } else {
        await boardApi.create(data);
      }
      navigate('/boards');
    } catch {
      alert('저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div>
        <Breadcrumb items={[{ label: '커뮤니티' }, { label: '게시판', path: '/boards' }, { label: isEdit ? '수정' : '글쓰기' }]} />
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? '글 수정' : '새 글 작성'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Options */}
        <div className="flex items-center gap-6 rounded border bg-card p-4">
          <div className="flex items-center gap-3">
            <Switch id="notice" checked={noticeYn} onCheckedChange={setNoticeYn} />
            <Label htmlFor="notice" className="text-sm cursor-pointer">공지 상단고정</Label>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-3">
            <Switch id="status" checked={statusYn} onCheckedChange={setStatusYn} />
            <Label htmlFor="status" className="text-sm cursor-pointer">사용여부</Label>
          </div>
        </div>

        {/* 제목 */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            제목 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11"
          />
        </div>

        {/* 파일 첨부 — 제목과 내용 사이 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">파일 첨부</Label>
            {files.length > 0 && (
              <span className="text-xs text-muted-foreground">{files.length}개 파일</span>
            )}
          </div>

          {/* Dropzone — 컴팩트 */}
          <div
            {...getRootProps()}
            className={`
              flex items-center gap-3 rounded border border-dashed px-4 py-3
              transition-colors cursor-pointer
              ${isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40 hover:bg-muted/30'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">
                {isDragActive ? '여기에 놓으세요' : '파일을 드래그하거나 클릭하세요'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                이미지, PDF, Word, Excel (최대 10MB)
              </p>
            </div>
          </div>

          {/* 첨부된 파일 목록 — 테이블 형태 */}
          {files.length > 0 && (
            <div className="rounded border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">파일명</th>
                    <th className="px-3 py-2 text-right text-[11px] font-medium text-muted-foreground w-[80px]">크기</th>
                    <th className="px-3 py-2 w-[40px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.file_id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/5 text-primary">
                            {getFileIcon(file.file_type)}
                          </span>
                          <span className="text-xs font-medium truncate">{file.original_name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-[11px] text-muted-foreground whitespace-nowrap">
                        {file.file_size >= 1048576
                          ? `${(file.file_size / 1048576).toFixed(1)} MB`
                          : `${(file.file_size / 1024).toFixed(0)} KB`
                        }
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => removeFile(file.file_id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 내용 — TinyMCE */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">내용</Label>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key'}
            onInit={(_evt, editor) => { editorRef.current = editor; }}
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            init={{
              height: 500,
              menubar: false,
              language: 'ko_KR',
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
              ],
              toolbar:
                'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | ' +
                'image link table | removeformat | code | help',
              content_style: `
                body {
                  font-family: 'Noto Sans KR', sans-serif;
                  font-size: 14px;
                  line-height: 1.7;
                  color: #111827;
                }
              `,
              images_upload_handler: async (blobInfo) => {
                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                const res = await client.post('/api/files/editor-image', formData);
                return (res as unknown as { data: { url: string } }).data.url;
              },
              placeholder: '내용을 입력하세요',
              branding: false,
              promotion: false,
              statusbar: true,
              resize: true,
            }}
          />
        </div>

        {/* Submit */}
        <Separator />
        <div className="flex items-center justify-end gap-3">
          <Link to="/boards" className="inline-flex h-9 items-center rounded border border-border bg-white px-4 text-sm font-medium transition-colors hover:bg-muted">
            취소
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-9 items-center rounded bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
