import { SearchForm } from '../../components/movies/search-form';
import { SearchResultCard } from '../../components/movies/search-result-card';
import { movies } from '../../data/movies';
import { searchMovies } from '../../utils/movie-search';

export function MovieSearchPage({ query }: { query: string }) {
  const results = searchMovies(movies, query);

  if (!query)
    return (
      <section className="mx-auto max-w-[950px] px-5 pt-24 pb-32 sm:px-20 sm:pt-[209px]">
        <title>UMCine | 영화 검색</title>
        <h1 className="mb-9 text-center text-[28px] leading-[1.38] font-bold tracking-[-1.7px] sm:text-[38px]">
          어떤 영화를 찾고 있나요?
        </h1>
        <SearchForm key={query} query={query} prominent />
        <p className="mt-5 text-center text-sm text-muted">영화 제목을 입력해 검색해 보세요.</p>
      </section>
    );

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
        <span className="text-xs text-subtle">영화 {results.length}편</span>
      </div>
      {results.length ? (
        <div className="grid gap-x-10 min-[1100px]:grid-cols-2">
          {results.map((movie) => (
            <SearchResultCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-muted">
          검색 결과가 없어요. 다른 영화 제목으로 검색해 보세요.
        </p>
      )}
    </section>
  );
}
