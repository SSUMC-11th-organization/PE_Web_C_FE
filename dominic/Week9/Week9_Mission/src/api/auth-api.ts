import { useAuthStore } from '../stores/auth-store';
import { apiClient } from './api-client';

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = useAuthStore.getState().accessToken;
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        // 예전 세션의 늦은 401이 새 로그인까지 지우지 않게 요청 토큰을 비교해요.
        const token = useAuthStore.getState().accessToken;
        if (
          response.status === 401 &&
          token &&
          request.headers.get('Authorization') === `Bearer ${token}`
        ) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
