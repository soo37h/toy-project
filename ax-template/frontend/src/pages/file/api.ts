import client from '@/lib/client';

export const fileApi = {
  /** TinyMCE 에디터 이미지 업로드 */
  uploadEditorImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post('/api/files/editor-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** 첨부파일 업로드 (다중) */
  uploadAttachments: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return client.post('/api/files/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** 파일 다운로드 URL */
  getDownloadUrl: (fileId: number) =>
    `/api/files/download/${fileId}`,
};
