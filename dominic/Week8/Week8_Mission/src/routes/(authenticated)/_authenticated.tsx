import { createFileRoute, redirect } from '@tanstack/react-router';
import { AuthenticatedLayout } from '../../components/auth/authenticated-layout';
import { useAuthStore } from '../../stores/auth-store';

export const Route = createFileRoute('/(authenticated)/_authenticated')({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: '/login' });
  },
  component: AuthenticatedLayout,
});
