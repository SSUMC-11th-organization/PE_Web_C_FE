import { useQuery } from '@tanstack/react-query';
import { Outlet } from '@tanstack/react-router';
import { accountQueries } from '../../queries/account';
import { useAuthStore } from '../../stores/auth-store';
import { AccountError } from './request-error';

export function AuthenticatedLayout() {
  const { accessToken, session } = useAuthStore();
  const me = useQuery(accountQueries.me(session, !!accessToken));
  if (me.isLoading)
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
  return (
    <div data-testid="authenticated-layout">
      <Outlet />
    </div>
  );
}
