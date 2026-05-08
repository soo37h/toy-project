import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from './api';
import { useAuthStore } from '@/stores/auth';
import type { LoginData, SignupData } from './types';

/** 로그인 */
export function useLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const login = useCallback(async (data: LoginData) => {
    try {
      const res = await authApi.login(data);
      localStorage.setItem('accessToken', res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  }, [navigate, setUser]);

  return { login };
}

/** 회원가입 */
export function useSignup() {
  const navigate = useNavigate();

  const signup = useCallback(async (data: SignupData) => {
    try {
      await authApi.signup(data);
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  }, [navigate]);

  return { signup };
}
