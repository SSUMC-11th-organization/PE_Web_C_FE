import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim() ?? "";
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    let ignore = false;
    const searchQuery = query?.trim() ?? "";
    setMovies([]);
    setTotalResults(0);
    setErrorMessage(null);

    if (!searchQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchMovies({ query: searchQuery })
      .then((response) => {
        if (!ignore) {
          setMovies(response.results);
          setTotalResults(response.total_results);
        }
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

  const searchResults = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path),
    overview: movie.overview,
  }));

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  const searchForm = (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white p-1 shadow-sm"
    >
      <span className="pl-3 text-gray-400" aria-hidden="true">⌕</span>
      <input
        aria-label="검색어"
        placeholder="영화 제목을 검색해 보세요"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-gray-900 outline-none"
      />
      <button
        type="submit"
        className="rounded bg-gray-900 px-5 py-2 text-sm font-semibold text-white"
      >
        검색
      </button>
    </form>
  );

  if (!normalizedQuery) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-[#f5f6f8] px-6 pb-24">
        <h1 className="mb-7 text-center text-2xl font-bold text-gray-900">
          어떤 영화를 찾고 있나요?
        </h1>
        <div className="w-full max-w-xl">{searchForm}</div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f5f6f8]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-extrabold text-gray-900">영화 검색</h1>
        {searchForm}

        <div className="mt-7 border-b border-gray-200 pb-4">
          <h2 className="font-bold text-gray-900">‘{query}’ 검색 결과</h2>
          <p className="mt-1 text-sm text-gray-500">
            영화 {totalResults}편
          </p>
        </div>

        {isLoading ? (
          <p role="status" className="py-12 text-center text-gray-500">검색 결과를 불러오는 중이에요.</p>
        ) : errorMessage ? (
          <p role="alert" className="py-12 text-center text-gray-500">{errorMessage}</p>
        ) : searchResults.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            검색 결과가 없어요.
          </p>
        ) : (
          <ul className="grid list-none grid-cols-1 gap-x-8 p-0 md:grid-cols-2">
            {searchResults.map((movie) => (
              <li
                key={movie.id}
                className="flex min-w-0 gap-4 border-b border-gray-200 py-5"
              >
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="shrink-0"
                >
                  {movie.posterPath ? (
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="h-36 w-24 rounded object-cover"
                    />
                  ) : (
                    <div className="grid h-36 w-24 place-items-center rounded bg-gray-200 text-xs text-gray-500">
                      이미지 없음
                    </div>
                  )}
                </Link>

                <div className="min-w-0 text-left">
                  <h3 className="font-bold text-gray-900">{movie.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {movie.originalTitle}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {movie.releaseDate}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                    {movie.overview}
                  </p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="mt-3 inline-block text-sm font-semibold text-blue-600"
                  >
                    상세 보기 →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
