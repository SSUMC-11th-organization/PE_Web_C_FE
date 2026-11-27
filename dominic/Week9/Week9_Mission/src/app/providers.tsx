'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { SessionBoundary } from '@/components/auth/session-boundary';
import { createQueryClient } from '@/queries/client';
import { useAuthStore } from '@/stores/auth-store';
import { useViewSettingsStore } from '@/stores/view-settings-store';

export function Providers({ children }: { children: React.ReactNode }) {
  // Server rendering gets a fresh client per render; no cross-request member cache.
  const [client] = useState(createQueryClient);
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useViewSettingsStore.persist.rehydrate();
  }, []);
  return (
    <QueryClientProvider client={client}>
      <SessionBoundary />
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
