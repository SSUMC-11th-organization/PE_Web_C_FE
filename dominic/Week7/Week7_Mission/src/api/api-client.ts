import ky from 'ky';

// 회원 API에는 TMDB의 Authorization 헤더를 공유하지 않아요.
export const apiClient = ky.create({
  baseUrl: `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '')}/`,
  timeout: 10_000,
  retry: 0,
});
