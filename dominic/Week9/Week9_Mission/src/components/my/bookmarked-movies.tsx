'use client';

import { useQueries, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { accountQueries } from '../../queries/account';
import { movieQueries } from '../../queries/movies';
import { useAuthStore } from '../../stores/auth-store';
import { toMovie } from '../../utils/movies/adapters';
import { AccountError } from '../auth/request-error';
import { MovieCard } from '../movies/movie-card';
import { Pagination } from '../movies/pagination';

export function BookmarkedMovies() {
  const { accessToken, session } = useAuthStore();
  const favorites = useQuery(accountQueries.favorites(session, !!accessToken));
  const ids = favorites.data ?? [];
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(ids.length / 5);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const visibleIds = ids.slice((currentPage - 1) * 5, currentPage * 5);
  const queries = useQueries({ queries: visibleIds.map(movieQueries.detail) });
  if (favorites.isError)
    return (
      <div className="space-y-3">
        <AccountError error={favorites.error} />
        <button type="button" onClick={() => void favorites.refetch()}>
          즐겨찾기 다시 조회
        </button>
      </div>
    );
  if (favorites.isLoading) return <p role="status">즐겨찾기를 불러오는 중이에요.</p>;
  if (!ids.length)
    return (
      <div className="rounded-xl border border-line bg-white p-10 text-center">
        <p className="mb-3 text-sm text-muted">아직 즐겨찾기한 영화가 없어요.</p>
        <Link href="/?page=1" className="text-sm font-bold text-primary">
          영화 둘러보기
        </Link>
      </div>
    );
  return (
    <>
      <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 min-[700px]:grid-cols-3 min-[1100px]:grid-cols-5">
        {queries.map((query, index) => (
          <div key={visibleIds[index]}>
            {query.data ? (
              <MovieCard movie={toMovie(query.data)} />
            ) : query.isError ? (
              <div role="alert" className="rounded-lg border border-line p-5 text-sm">
                <p>영화를 불러오지 못했어요.</p>
                <button
                  type="button"
                  className="mt-3 text-primary"
                  onClick={() => void query.refetch()}
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <p role="status">영화를 불러오는 중이에요.</p>
            )}
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
