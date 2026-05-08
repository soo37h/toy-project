import { useState, useEffect, useCallback } from 'react';
import { boardApi } from './api';
import type { BoardItem, BoardDetail, Pagination, BoardListParams, SearchType } from './types';

/** 게시글 목록 조회 */
export function useBoardList(initialParams?: Partial<BoardListParams>) {
  const [list, setList] = useState<BoardItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<BoardListParams>({
    page: 1,
    pageSize: 10,
    ...initialParams,
  });

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await boardApi.getList(params);
      setList(res.data.list);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  /** 검색 실행 */
  const search = useCallback((searchType: SearchType, keyword: string, startDate?: string, endDate?: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      searchType,
      keyword,
      startDate,
      endDate,
    }));
  }, []);

  /** 페이지 변경 */
  const goToPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  return { list, pagination, loading, params, search, goToPage, refetch: fetchList };
}

/** 게시글 상세 조회 */
export function useBoardDetail(boardId: number | null) {
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!boardId) return;

    let cancelled = false;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await boardApi.getDetail(boardId);
        if (!cancelled) setBoard(res.data);
      } catch (error) {
        console.error('게시글 상세 조회 실패:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchDetail();
    return () => { cancelled = true; };
  }, [boardId]);

  return { board, loading };
}
