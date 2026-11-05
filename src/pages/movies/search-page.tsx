import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
//import { movies } from "../../data/movies";
import { searchMovies } from "../../api/movies/search-movies"
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";


export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const normalizedQuery = query?.trim() ?? "";

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="search-page">
      <h1>영화 검색</h1>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button type="submit">검색</button>
      </form>

      {!normalizedQuery ? (
        <p>검색어를 입력해 주세요.</p>
      ) : searchQuery.isLoading ? (
        <p>검색 결과를 불러오는 중이에요.</p>
      ) : searchQuery.isError ? (
        <p>{searchQuery.error.message}</p>
      ) : (
        <>
          <h2>‘{query}’ 검색 결과</h2>
          <p>현재 페이지에 영화 {searchResults.length}편</p>

          {searchResults.length === 0 ? (
            <p>검색 결과가 없어요.</p>
          ) : (
            <ul>
              {searchResults.map((movie) => {
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <li key={movie.id}>
                    <div className="aspect-[2/3] w-[150px] overflow-hidden bg-gray-200">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                          className="block h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-600">
                          이미지 없음
                        </div>
                      )}
                    </div>

                    <h3>{movie.title}</h3>
                    <p>{movie.original_title}</p>
                    <p>{movie.release_date}</p>
                    <p>{movie.overview}</p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      상세 보기
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </main>
  );
}