'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthHydrated } from '@/hooks/use-auth-hydrated';
import { useAuthStore } from '@/stores/auth-store';
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthHydrated();
  const token = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  useEffect(() => {
    if (hydrated && token) router.replace('/');
  }, [hydrated, token, router]);
  return !hydrated || token ? (
    <p role="status" className="p-10 text-center">
      로그인 상태를 확인하고 있어요.
    </p>
  ) : (
    children
  );
}
