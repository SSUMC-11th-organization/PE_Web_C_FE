import type { Metadata } from 'next';
import { MovieSearchPage } from '@/screens/movies/movie-search-page';
import { MovieHydration } from '@/server/movie-hydration';
import { validateMovieSearch } from '@/utils/movies/route-search';

type Props = { searchParams: Promise<{ query?: string; page?: string }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { query } = validateMovieSearch(await searchParams);
  return { title: query ? `${query} 검색 결과` : '영화 검색' };
}
export default async function Page({ searchParams }: Props) {
  const { query, page } = validateMovieSearch(await searchParams);
  return (
    <MovieHydration kind="search" query={query} page={page}>
      <MovieSearchPage key={JSON.stringify([query, page])} query={query} page={page} />
    </MovieHydration>
  );
}
