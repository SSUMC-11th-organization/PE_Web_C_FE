import { useEffect, useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import {
  readBookmarkIds,
  saveBookmarkIds,
} from "../../utils/bookmark-storage";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [bookmarkedMovieIds, setBookmarkedMovieIds] =
    useState<number[]>(() => readBookmarkIds());

  // 영화 목록 요청
  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  // 받은 영화 데이터에 북마크 여부 추가
  const moviesWithBookmarks = movies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  // 북마크 토글
  const handleToggleBookmark = (movieId: number) => {
    setBookmarkedMovieIds((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId],
    );
  };

  // 북마크 저장
  useEffect(() => {
    saveBookmarkIds(bookmarkedMovieIds);
  }, [bookmarkedMovieIds]);

  return (
    <div className="movies-page">
      <main className="movies-page__main">
        <h2 className="movies-page__title">영화 목록</h2>

        {isLoading ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <MovieGrid
            movies={moviesWithBookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </main>
    </div>
  );
}