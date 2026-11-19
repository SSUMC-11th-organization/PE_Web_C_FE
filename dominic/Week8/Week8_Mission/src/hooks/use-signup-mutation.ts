import { useMutation } from '@tanstack/react-query';
import { accountMutations } from '../queries/account';
export const useSignupMutation = () => useMutation(accountMutations.signup());
