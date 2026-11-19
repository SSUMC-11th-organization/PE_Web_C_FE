import { mutationOptions, type QueryClient, queryOptions } from '@tanstack/react-query';
import {
  changeFavorite,
  deleteRating,
  getFavorite,
  getFavorites,
  getMe,
  getRatings,
  login,
  saveRating,
  updateMe,
} from '../api/account';
import { signup } from '../api/members/requests';
import { useAuthStore } from '../stores/auth-store';

export const accountKeys = {
  me: (session: number) => ['members', 'me', session] as const,
  favorites: (session: number) => ['favorites', session, 'list'] as const,
  favorite: (session: number, movieId: number) => ['favorites', session, 'movie', movieId] as const,
  ratings: (session: number, memberId: number) => ['ratings', session, memberId] as const,
};
export const accountQueries = {
  me: (session: number, enabled: boolean) =>
    queryOptions({
      queryKey: accountKeys.me(session),
      queryFn: ({ signal }) => getMe(signal),
      enabled,
      staleTime: 300_000,
      retry: false,
      meta: { private: true },
    }),
  favorites: (session: number, enabled: boolean) =>
    queryOptions({
      queryKey: accountKeys.favorites(session),
      queryFn: ({ signal }) => getFavorites(signal),
      enabled,
      retry: false,
      meta: { private: true },
    }),
  favorite: (session: number, movieId: number, enabled: boolean) =>
    queryOptions({
      queryKey: accountKeys.favorite(session, movieId),
      queryFn: ({ signal }) => getFavorite(movieId, signal),
      enabled,
      retry: false,
      meta: { private: true },
    }),
  ratings: (session: number, memberId: number, enabled: boolean) =>
    queryOptions({
      queryKey: accountKeys.ratings(session, memberId),
      queryFn: ({ signal }) => getRatings(memberId, signal),
      enabled: enabled && memberId > 0,
      retry: false,
      meta: { private: true },
    }),
};
const sameSession = (session: number) =>
  useAuthStore.getState().session === session && !!useAuthStore.getState().accessToken;
export const accountMutations = {
  signup: () =>
    mutationOptions({ mutationKey: ['signup'], mutationFn: signup, retry: false, gcTime: 0 }),
  login: () =>
    mutationOptions({ mutationKey: ['login'], mutationFn: login, retry: false, gcTime: 0 }),
  updateMe: (client: QueryClient, session: number, mode: 'direct' | 'invalidate') =>
    mutationOptions({
      mutationKey: ['updateMe', session],
      mutationFn: updateMe,
      retry: false,
      onSuccess: async (member) => {
        if (!sameSession(session)) return;
        // 늦게 도착하는 기존 GET이 수정 응답을 덮어쓰지 않도록 먼저 중단해요.
        await client.cancelQueries({ queryKey: accountKeys.me(session) });
        if (!sameSession(session)) return;
        if (mode === 'direct') client.setQueryData(accountKeys.me(session), member);
        else await client.invalidateQueries({ queryKey: accountKeys.me(session) });
      },
    }),
  favorite: (client: QueryClient, session: number) =>
    mutationOptions({
      mutationKey: ['favorite', session],
      scope: { id: `favorite-${session}` },
      mutationFn: changeFavorite,
      retry: false,
      onSuccess: async ({ movieId, favorite }) => {
        if (!sameSession(session)) return;
        await client.cancelQueries({ queryKey: ['favorites', session] });
        if (!sameSession(session)) return;
        client.setQueryData(accountKeys.favorite(session, movieId), favorite);
        // 상세 상태는 응답으로 즉시 바꾸고, 전체 목록은 서버의 원본을 다시 조회해요.
        await client.invalidateQueries({ queryKey: accountKeys.favorites(session) });
      },
    }),
  saveRating: (client: QueryClient, session: number, memberId: number, onSaved?: () => void) =>
    mutationOptions({
      mutationKey: ['saveRating', session],
      mutationFn: saveRating,
      retry: false,
      onSuccess: () => {
        if (!sameSession(session)) return;
        onSaved?.();
        return client.invalidateQueries({ queryKey: accountKeys.ratings(session, memberId) });
      },
    }),
  deleteRating: (client: QueryClient, session: number, memberId: number, onSaved?: () => void) =>
    mutationOptions({
      mutationKey: ['deleteRating', session],
      mutationFn: deleteRating,
      retry: false,
      onSuccess: () => {
        if (!sameSession(session)) return;
        onSaved?.();
        return client.invalidateQueries({ queryKey: accountKeys.ratings(session, memberId) });
      },
    }),
};
