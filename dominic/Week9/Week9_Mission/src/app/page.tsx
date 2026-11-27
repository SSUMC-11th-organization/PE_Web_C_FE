import { MovieListPage } from '@/screens/movies/movie-list-page';
import { MovieHydration } from '@/server/movie-hydration';
import { parsePage } from '@/utils/movies/route-search';

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage((await searchParams).page);
  return (
    <MovieHydration kind="list" page={page}>
      <MovieListPage key={page} page={page} />
    </MovieHydration>
  );
}
