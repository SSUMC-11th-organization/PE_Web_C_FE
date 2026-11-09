import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieListPage() {
  const [page, setPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  function handleToggleBookmark(movieId: number) {
    setBookmarkedIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
  }

  const movieCards = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path),
    isBookmarked: bookmarkedIds.includes(movie.id),
  }));

  return (
    <>
      <main className="mx-auto min-h-[720px] max-w-7xl px-6 py-9">
        <h1 className="mb-6 text-3xl font-extrabold text-gray-900">영화 목록</h1>
        {moviesQuery.isPending ? (
          <p role="status">영화 목록을 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p role="alert">영화 목록을 불러오지 못했어요.</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <MovieGrid movies={movieCards} onToggleBookmark={handleToggleBookmark} />
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded border px-4 py-2 disabled:opacity-40"
          >이전</button>
          <span>{page}페이지</span>
          <button
            type="button"
            disabled={!moviesQuery.data || page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded border px-4 py-2 disabled:opacity-40"
          >다음</button>
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-white px-6 py-6 text-center text-xs text-gray-500">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </>
  );
}
