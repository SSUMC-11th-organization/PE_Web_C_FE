import { useState } from "react";
import { Pagination } from "../../components/movies/pagination";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page: Math.ceil(page / 2) }),
  });

  const allMovies = moviesQuery.data?.results ?? [];
  const movies = allMovies.slice((page - 1) % 2 * 10, ((page - 1) % 2 + 1) * 10);
  const totalPages = Math.min((moviesQuery.data?.total_pages ?? 0) * 2, 1000);

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
            <MovieGrid movies={movies} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </main>
    </div>
  );
}