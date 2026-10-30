import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { searchMovies } from '../../api/movies/search-movies';
import { Pagination } from '../../components/movies/pagination';
import { RequestError, RequestLoading } from '../../components/movies/request-feedback';
import { SearchForm } from '../../components/movies/search-form';
import { SearchResultCard } from '../../components/movies/search-result-card';
import { useMovieRequest } from '../../hooks/use-movie-request';
import { toMovie } from '../../utils/movies/adapters';

export function MovieSearchPage({ query, page }: { query: string; page: number }) {
  if (!query.trim())
    return (
      <section className="mx-auto max-w-[950px] px-5 pt-24 pb-32 sm:px-20 sm:pt-[209px]">
        <title>UMCine | 영화 검색</title>
        <h1 className="mb-9 text-center text-[28px] leading-[1.38] font-bold tracking-[-1.7px] sm:text-[38px]">
          어떤 영화를 찾고 있나요?
        </h1>
        <SearchForm query="" prominent />
        <p className="mt-5 text-center text-sm text-muted">영화 제목을 입력해 검색해 보세요.</p>
      </section>
    );
  return <SearchResults key={JSON.stringify([query, page])} query={query.trim()} page={page} />;
}

function SearchResults({ query, page }: { query: string; page: number }) {
  const navigate = useNavigate();
  const load = useCallback(
    (signal: AbortSignal) => searchMovies({ query, page, signal }),
    [query, page],
  );
  const { state, retry } = useMovieRequest(load);
  const response = state.status === 'success' ? state.data : null;
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-6 lg:px-20">
      <title>{`UMCine | ${query} 검색 결과`}</title>
      <h1 className="mb-[17px] text-[32px] leading-[44px] font-bold tracking-[-1.71px] sm:text-[38px]">
        영화 검색
      </h1>
      <SearchForm key={query} query={query} />
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-4"
        aria-live="polite"
      >
        <h2 className="min-w-0 break-all text-base font-bold">‘{query}’ 검색 결과</h2>
        {response && (
          <span className="text-xs text-subtle">
            영화 {response.total_results.toLocaleString()}편 · {page}페이지
          </span>
        )}
      </div>
      {state.status === 'loading' && <RequestLoading />}
      {state.status === 'error' && <RequestError error={state.error} onRetry={retry} />}
      {response &&
        (response.results.length ? (
          <div className="grid gap-x-10 min-[1100px]:grid-cols-2">
            {response.results.map((movie) => (
              <SearchResultCard key={movie.id} movie={toMovie(movie)} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-muted">
            검색 결과가 없어요. 다른 영화 제목으로 검색해 보세요.
          </p>
        ))}
      {response && (
        <Pagination
          currentPage={page}
          totalPages={response.total_pages}
          onPageChange={(next) => void navigate({ to: '/search', search: { query, page: next } })}
        />
      )}
    </section>
  );
}
