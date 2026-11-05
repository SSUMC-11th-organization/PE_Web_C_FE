import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import {
  readBookmarkIds,
  saveBookmarkIds,
} from "../../utils/bookmark-storage";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const [bookmarkedMovieIds, setBookmarkedMovieIds] = useState<number[]>(
    () => readBookmarkIds(),
  );

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const moviesWithBookmarks = movies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  const handleToggleBookmark = (movieId: number) => {
    setBookmarkedMovieIds((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId],
    );
  };

  useEffect(() => {
    saveBookmarkIds(bookmarkedMovieIds);
  }, [bookmarkedMovieIds]);

  return (
    <div className="movies-page">
      <main className="movies-page__main">
        <h2 className="movies-page__title">영화 목록</h2>

        {moviesQuery.isPending ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p>{moviesQuery.error.message}</p>
        ) : movies.length === 0 ? (
          <p>표시할 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid
              movies={moviesWithBookmarks}
              onToggleBookmark={handleToggleBookmark}
            />

            <div>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                이전
              </button>

              <span> {page} / {totalPages} </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                다음
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}