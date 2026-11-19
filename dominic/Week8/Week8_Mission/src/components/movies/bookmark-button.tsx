import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useRef } from 'react';
import { accountMutations, accountQueries } from '../../queries/account';
import { useAuthStore } from '../../stores/auth-store';
import type { Movie } from '../../types/movie';
import { cn } from '../../utils/cn';
import { AccountError } from '../auth/request-error';
import { Icon } from '../layout/icon';

export function BookmarkButton({ movie, iconOnly = false }: { movie: Movie; iconOnly?: boolean }) {
  const { accessToken, session } = useAuthStore();
  const locked = useRef(false);
  const client = useQueryClient();
  const navigate = useNavigate();
  const list = useQuery(accountQueries.favorites(session, !!accessToken && iconOnly));
  const state = useQuery(accountQueries.favorite(session, movie.id, !!accessToken && !iconOnly));
  const mutation = useMutation(accountMutations.favorite(client, session));
  const bookmarked = iconOnly ? list.data?.includes(movie.id) : state.data;
  const query = iconOnly ? list : state;
  const pending = mutation.isPending || (!!accessToken && query.isLoading);
  const error = mutation.error || query.error;
  return (
    <div className={iconOnly ? 'contents' : 'space-y-3'}>
      <button
        type="button"
        aria-label={`${movie.title} 즐겨찾기${bookmarked ? ' 해제' : ''}`}
        aria-pressed={!!bookmarked}
        disabled={pending}
        title={query.isError ? '즐겨찾기 상태 조회 실패 · 다시 시도' : undefined}
        onClick={() => {
          if (!accessToken) {
            void navigate({ to: '/login' });
            return;
          }
          if (pending || locked.current) return;
          if (query.isError) {
            void query.refetch();
            return;
          }
          locked.current = true;
          mutation.mutate(
            { movieId: movie.id, favorite: !bookmarked },
            {
              onSettled: () => {
                locked.current = false;
              },
            },
          );
        }}
        className={cn(
          'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border text-sm font-bold disabled:opacity-50',
          iconOnly
            ? 'absolute top-2.5 right-2.5 size-[34px] border-white bg-ink text-white'
            : 'h-[42px] border-primary bg-primary px-4 text-white',
          bookmarked && (iconOnly ? 'border-primary bg-primary' : 'border-ink bg-ink'),
        )}
      >
        <Icon name={bookmarked ? 'bookmark' : 'bookmark-outline'} small={!iconOnly} inverted />
        {!iconOnly &&
          (pending
            ? '처리 중'
            : query.isError
              ? '즐겨찾기 다시 조회'
              : bookmarked
                ? '즐겨찾기 해제'
                : '즐겨찾기')}
      </button>
      {error &&
        (iconOnly ? (
          <span
            role="status"
            className="absolute right-2 bottom-2 left-2 rounded bg-red-50 p-2 text-xs text-red-700"
          >
            즐겨찾기 처리 실패
          </span>
        ) : (
          <AccountError error={error} />
        ))}
    </div>
  );
}
