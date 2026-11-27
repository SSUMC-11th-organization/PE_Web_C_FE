'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FetchPractice } from '../../components/movies/fetch-practice';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { RequestError, RequestLoading } from '../../components/movies/request-feedback';
import { ViewSettings } from '../../components/movies/view-settings';
import { useQueryRequest } from '../../hooks/use-query-request';
import { accountQueries } from '../../queries/account';
import { movieQueries } from '../../queries/movies';
import { useAuthStore } from '../../stores/auth-store';
import { useViewSettingsStore } from '../../stores/view-settings-store';
import { sortMovies } from '../../utils/movie-sort';
import { toMovie } from '../../utils/movies/adapters';

export function MovieListPage({ page }: { page: number }) {
  const router = useRouter();
  const { state, retry } = useQueryRequest(movieQueries.list(page));
  const { accessToken, session } = useAuthStore();
  const favorites = useQuery(accountQueries.favorites(session, !!accessToken));
  const bookmarkedIds = favorites.data ?? [];
  const sortOrder = useViewSettingsStore((store) => store.sortOrder);
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const response = state.status === 'success' ? state.data : null;
  const movies = response?.results.map(toMovie) ?? [];
  const visibleMovies = sortMovies(
    bookmarksOnly ? movies.filter((movie) => bookmarkedIds.includes(movie.id)) : movies,
    sortOrder,
  );

  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-6 pb-12 lg:px-20">
      <h1 className="mb-5 text-[32px] leading-[44px] font-bold tracking-[-1.71px] sm:text-[38px]">
        영화 목록
      </h1>
      <ViewSettings />
      <FetchPractice />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 font-bold">
          <input
            type="checkbox"
            checked={bookmarksOnly}
            onChange={(event) => setBookmarksOnly(event.target.checked)}
            disabled={!accessToken || !favorites.data}
            className="size-4 accent-primary"
          />
          현재 페이지 즐겨찾기만 보기
        </label>
        {response && (
          <span className="text-subtle" aria-live="polite">
            전체 {response.total_results.toLocaleString()}편 · {page}페이지 · 표시{' '}
            {visibleMovies.length}편
          </span>
        )}
      </div>
      {state.status === 'loading' && <RequestLoading />}
      {state.status === 'error' && <RequestError error={state.error} onRetry={retry} />}
      {response &&
        (visibleMovies.length ? (
          <MovieGrid movies={visibleMovies} />
        ) : (
          <p className="rounded-xl border border-line bg-white px-5 py-20 text-center text-muted">
            {bookmarksOnly
              ? '현재 페이지에 북마크한 영화가 없어요.'
              : '이 페이지에는 영화가 없어요.'}
          </p>
        ))}
      {response && (
        <Pagination
          currentPage={page}
          totalPages={response.total_pages}
          onPageChange={(next) => router.push(`/?page=${next}`)}
        />
      )}
    </section>
  );
}
