import { type QueryKey, type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { RequestState } from './use-movie-request';

export function useQueryRequest<T, K extends QueryKey>(options: UseQueryOptions<T, Error, T, K>) {
  const query = useQuery(options);
  // 백그라운드 재조회 실패 시에도 기존 성공 데이터를 유지해요.
  const state: RequestState<T> =
    query.data !== undefined
      ? { status: 'success', data: query.data }
      : query.isError
        ? { status: 'error', error: query.error }
        : { status: 'loading' };
  return {
    state,
    retry: () => {
      void query.refetch();
    },
  };
}
