'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthHydrated } from '../../hooks/use-auth-hydrated';
import { accountQueries } from '../../queries/account';
import { useAuthStore } from '../../stores/auth-store';
import { AccountError } from './request-error';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthHydrated();
  const router = useRouter();
  const { accessToken, session } = useAuthStore();
  const me = useQuery(accountQueries.me(session, hydrated && !!accessToken));
  useEffect(() => {
    if (hydrated && !accessToken) router.replace('/login');
  }, [hydrated, accessToken, router]);
  if (!hydrated || !accessToken || me.isLoading)
    return (
      <p role="status" className="p-10 text-center">
        내 정보를 확인하고 있어요.
      </p>
    );
  if (me.isError)
    return (
      <section className="mx-auto max-w-xl space-y-4 p-8">
        <AccountError error={me.error} />
        <button type="button" onClick={() => void me.refetch()}>
          다시 시도
        </button>
      </section>
    );
  if (!me.data || !accessToken) return null;
  return <div data-testid="authenticated-layout">{children}</div>;
}
