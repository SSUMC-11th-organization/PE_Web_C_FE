import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { accountMutations } from '../queries/account';
import { useAuthStore } from '../stores/auth-store';
export function useLoginMutation() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    ...accountMutations.login(),
    onSuccess: (data) => {
      useAuthStore.getState().setAccessToken(data.accessToken);
      void client.invalidateQueries({ queryKey: ['members', 'me'] });
      router.replace('/?page=1');
    },
  });
}
