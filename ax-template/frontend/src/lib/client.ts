import axios from 'axios';

const isMock = import.meta.env.VITE_USE_MOCK === 'true';

const client = axios.create({
  baseURL: isMock ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:8080'),
  timeout: 10000,
});

// Request: JWT 토큰 자동 첨부
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: 공통 처리
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default client;
