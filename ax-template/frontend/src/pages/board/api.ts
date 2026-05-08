import client from '@/lib/client';
import type { BoardListParams, BoardFormData } from './types';

export const boardApi = {
  /** 게시글 목록 (검색 + 페이징) */
  getList: (params: BoardListParams) =>
    client.get('/api/boards', { params }),

  /** 게시글 상세 (조회수 자동 증가) */
  getDetail: (boardId: number) =>
    client.get(`/api/boards/${boardId}`),

  /** 게시글 등록 */
  create: (data: BoardFormData) =>
    client.post('/api/boards', data),

  /** 게시글 수정 */
  update: (boardId: number, data: BoardFormData) =>
    client.put(`/api/boards/${boardId}`, data),

  /** 게시글 삭제 */
  delete: (boardId: number) =>
    client.delete(`/api/boards/${boardId}`),
};
