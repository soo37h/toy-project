import client from '@/lib/client';
import type { LoginData, SignupData } from './types';

export const authApi = {
  /** 로그인 */
  login: (data: LoginData) =>
    client.post('/api/auth/login', data),

  /** 회원가입 */
  signup: (data: SignupData) =>
    client.post('/api/auth/signup', data),

  /** 내 정보 조회 */
  getMe: () =>
    client.get('/api/auth/me'),
};
