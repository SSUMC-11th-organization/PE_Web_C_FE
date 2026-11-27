import { parseMovieList } from '@/api/movies/validate-response';
import 'server-only';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { createQueryClient } from '@/queries/client';
import { movieQueries } from '@/queries/movies';
import { readMovieDetail, requestTmdb, TmdbUpstreamError } from './tmdb';

type Props = {
  kind: 'list' | 'search' | 'detail';
  page?: number;
  query?: string;
  movieId?: number;
  children: React.ReactNode;
};
export async function MovieHydration({ kind, page = 1, query = '', movieId = 0, children }: Props) {
  const client = createQueryClient();
  try {
    if (kind === 'detail')
      client.setQueryData(movieQueries.detail(movieId).queryKey, await readMovieDetail(movieId));
    else if (kind === 'list' || query.trim()) {
      const data = await requestTmdb(
        kind === 'list' ? 'movie/popular' : 'search/movie',
        new URLSearchParams({ page: String(page), query }),
      );
      const key =
        kind === 'list'
          ? movieQueries.list(page).queryKey
          : movieQueries.search(query, page).queryKey;
      client.setQueryData(key, parseMovieList(data));
    }
  } catch (error) {
    if (kind === 'detail' && error instanceof TmdbUpstreamError && error.status === 404) notFound();
    // Don't serialize upstream errors/credentials. Client requests provide safe retry UI.
  }
  return <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>;
}
