'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth-store';
export function SessionBoundary() {
  const client = useQueryClient();
  useEffect(
    () =>
      useAuthStore.subscribe((state, previous) => {
        if (state.session === previous.session) return;
        const filter = {
          predicate: (query: { meta?: Record<string, unknown> }) => query.meta?.private === true,
        };
        void client.cancelQueries(filter);
        client.removeQueries(filter);
      }),
    [client],
  );
  return null;
}
