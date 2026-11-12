import { useQueries } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { movieQueries } from '../../queries/movies';
import { useBookmarkStore } from '../../stores/bookmark-store';
import { toMovie } from '../../utils/movies/adapters';
import { MovieCard } from '../movies/movie-card';
import { Pagination } from '../movies/pagination';

export function BookmarkedMovies() {
  const ids = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(ids.length / 5);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const visibleIds = ids.slice((currentPage - 1) * 5, currentPage * 5);
  const queries = useQueries({ queries: visibleIds.map(movieQueries.detail) });
  if (!ids.length)
    return (
      <div className="rounded-xl border border-line bg-white p-10 text-center">
        <p className="mb-3 text-sm text-muted">아직 즐겨찾기한 영화가 없어요.</p>
        <Link to="/" search={{ page: 1 }} className="text-sm font-bold text-primary">
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
              <p role="status" className="rounded-lg bg-white p-5 text-sm text-muted">
                즐겨찾기를 불러오는 중이에요.
              </p>
            )}
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
