
import { useEffect, useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";
import {
  readBookmarkIds,
  saveBookmarkIds,
} from "../../utils/bookmark-storage";

export function MovieListPage() {
  // 1. 저장된 북마크 ID 불러오기
  const [bookmarkedMovieIds, setBookmarkedMovieIds] =
    useState<number[]>(() => readBookmarkIds());

  // 2. 북마크 ID를 기준으로 영화 목록 만들기
  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  // 3. 북마크 버튼 클릭 시 ID 추가 또는 제거
  const handleToggleBookmark = (movieId: number) => {
    setBookmarkedMovieIds((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId],
    );
  };

  // 4. 북마크가 변경되면 localStorage에 저장
  useEffect(() => {
    saveBookmarkIds(bookmarkedMovieIds);
  }, [bookmarkedMovieIds]);

  return (
    <div className="movies-page">
      <main className="movies-page__main">
        <h2 className="movies-page__title">영화 목록</h2>
        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>
    </div>
  );
}
