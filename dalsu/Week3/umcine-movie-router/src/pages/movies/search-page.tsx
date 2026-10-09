import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "../../components/icons";
import { Container } from "../../components/layout/container";
import { SearchForm } from "../../components/movies/search-form";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  // 뒤로 가기·앞으로 가기로 URL의 query가 바뀌면 입력창도 맞춰요
  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit() {
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  if (!normalizedQuery) {
    return (
      <Container className="flex flex-col items-center pb-40 pt-28 sm:pt-52">
        <h1 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          어떤 영화를 찾고 있나요?
        </h1>
        <p className="mt-4 text-gray-500">검색어를 입력해 주세요.</p>
        <div className="mt-8 w-full max-w-[760px]">
          <SearchForm
            variant="hero"
            value={searchText}
            onChange={setSearchText}
            onSubmit={handleSubmit}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-16 pt-8">
      <h1 className="text-4xl font-bold tracking-tight text-ink">영화 검색</h1>
      <div className="mt-6">
        <SearchForm
          variant="compact"
          value={searchText}
          onChange={setSearchText}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-bold text-ink">‘{query}’ 검색 결과</h2>
        <p className="shrink-0 text-sm text-gray-400">
          영화 {searchResults.length}편 · 1페이지
        </p>
      </div>

      {searchResults.length === 0 ? (
        <p className="py-24 text-center text-gray-500">검색 결과가 없어요.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-x-14 lg:grid-cols-2">
          {searchResults.map((movie) => (
            <li key={movie.id} className="flex gap-6 border-b border-gray-300 py-8">
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                className="shrink-0 overflow-hidden rounded-lg"
              >
                <img
                  className="h-[190px] w-[126px] object-cover"
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                />
              </Link>
              <div className="flex min-w-0 flex-col py-1">
                <h3 className="text-xl font-bold text-ink">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="hover:underline"
                  >
                    {movie.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  {movie.originalTitle}
                  <span className="ml-2">{movie.releaseDate}</span>
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                  {movie.overview}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="mt-auto inline-flex w-fit items-center gap-1 pt-3 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  상세 보기
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
