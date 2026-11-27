'use client';
import { useSyncExternalStore } from 'react';
import { useAuthStore } from '../stores/auth-store';

const subscribe = (notify: () => void) => {
  const start = useAuthStore.persist.onHydrate(notify);
  const finish = useAuthStore.persist.onFinishHydration(notify);
  return () => {
    start();
    finish();
  };
};
export function useAuthHydrated() {
  return useSyncExternalStore(subscribe, useAuthStore.persist.hasHydrated, () => false);
}
