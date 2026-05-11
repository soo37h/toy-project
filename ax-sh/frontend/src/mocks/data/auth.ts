import type { User } from '@/pages/auth/types';

export const mockUsers: (User & { password: string })[] = [
  { member_id: 1, email: 'admin@example.com', password: 'password123', nickname: '관리자', role: 'ADMIN' },
  { member_id: 2, email: 'user1@example.com', password: 'password123', nickname: '홍길동', role: 'USER' },
  { member_id: 3, email: 'user2@example.com', password: 'password123', nickname: '김철수', role: 'USER' },
  { member_id: 4, email: 'user3@example.com', password: 'password123', nickname: '이영희', role: 'USER' },
];

/** Mock JWT — 실제 JWT가 아닌 학습용 더미 */
export const mockToken = 'mock-jwt-token-for-development';
