import { useState } from 'react';
import { useMovies } from '../../components/movies/movie-context';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';

export function MovieListPage() {
  const { movies, toggleBookmark } = useMovies();
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-6 pb-12 lg:px-20">
      <title>UMCine | 영화 목록</title>
      <h1 className="mb-5 text-[32px] leading-[44px] font-bold tracking-[-1.71px] sm:text-[38px]">
        영화 목록
      </h1>
      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </section>
  );
}
