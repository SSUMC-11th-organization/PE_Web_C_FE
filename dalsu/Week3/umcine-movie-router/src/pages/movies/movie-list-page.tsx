import { useState } from "react";
import { Container } from "../../components/layout/container";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/pagination";
import { movies as initialMovies } from "../../data/movies";

// Figma처럼 한 페이지에 5열 × 2줄씩 보여 줘요
const MOVIES_PER_PAGE = 10;

export function MovieListPage() {
  // 영화 목록 전체를 state로 관리해서, 북마크를 누른 카드만 다시 그려지도록 해요.
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));
  const pageMovies = movies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE,
  );

  function handleToggleBookmark(movieId: number) {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  }

  return (
    <Container className="pb-20 pt-8">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-ink">영화 목록</h1>
      <MovieGrid movies={pageMovies} onToggleBookmark={handleToggleBookmark} />
      <div className="mt-11">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  );
}
