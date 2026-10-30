import { useEffect, useState } from "react";
import MovieGrid from "../../components/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();
    return () => {
      ignore = true;
    };
  }, []);

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
        <h1 className="mb-6 text-3xl font-extrabold text-gray-900">
          영화 목록
        </h1>
        {isLoading ? (
          <p role="status">영화 목록을 불러오는 중이에요.</p>
        ) : errorMessage ? (
          <p role="alert">{errorMessage}</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <MovieGrid movies={movieCards} onToggleBookmark={handleToggleBookmark} />
        )}
      </main>
      <footer className="border-t border-gray-200 bg-white px-6 py-6 text-center text-xs text-gray-500">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </>
  );
}
