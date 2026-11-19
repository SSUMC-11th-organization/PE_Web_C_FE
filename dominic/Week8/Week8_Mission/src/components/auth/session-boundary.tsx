import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth-store';
export function SessionBoundary() {
  const client = useQueryClient();
  const router = useRouter();
  useEffect(
    () =>
      useAuthStore.subscribe((state, previous) => {
        if (state.session === previous.session) return;
        const filter = {
          predicate: (query: { meta?: Record<string, unknown> }) => query.meta?.private === true,
        };
        // 회원 데이터는 Query에만 보관하고 세션 변경 때 폐기해요.
        void client.cancelQueries(filter);
        client.removeQueries(filter);
        void router.invalidate();
      }),
    [client, router],
  );
  return null;
}
