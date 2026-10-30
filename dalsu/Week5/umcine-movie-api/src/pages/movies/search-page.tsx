import { useEffect, useState } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movie-grid";
import StatusMessage from "../../components/status-message";
import { useLocation } from "../../router/navigation";

export default function SearchPage() {
  const { searchParams } = useLocation();
  const query = searchParams.get("query") ?? "";

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query.trim();

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  const normalizedQuery = query.trim();

  return (
    <main className="page">
      <h1>검색</h1>
      {!normalizedQuery ? (
        <StatusMessage kind="guide" message="검색어를 입력해 주세요." />
      ) : isLoading ? (
        <StatusMessage kind="loading" message="검색 결과를 불러오는 중이에요." />
      ) : errorMessage ? (
        <StatusMessage kind="error" message={errorMessage} />
      ) : movies.length === 0 ? (
        <StatusMessage kind="empty" message="조건에 맞는 영화가 없어요." />
      ) : (
        <>
          <p className="page__sub">'{normalizedQuery}' 검색 결과</p>
          <MovieGrid movies={movies} />
        </>
      )}
    </main>
  );
}
