import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { accountMutations } from '../queries/account';
import { useAuthStore } from '../stores/auth-store';
export function useLoginMutation() {
  const client = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    ...accountMutations.login(),
    onSuccess: (data) => {
      useAuthStore.getState().setAccessToken(data.accessToken);
      void client.invalidateQueries({ queryKey: ['members', 'me'] });
      void navigate({ to: '/', search: { page: 1 } });
    },
  });
}
