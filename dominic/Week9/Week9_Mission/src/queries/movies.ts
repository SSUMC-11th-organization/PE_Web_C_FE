import { queryOptions } from '@tanstack/react-query';
import { getMovieDetail } from '../api/movies/get-movie-detail';
import { getMovies } from '../api/movies/get-movies';
import { searchMovies } from '../api/movies/search-movies';
import { parsePage } from '../utils/movies/route-search';

export const movieQueries = {
  list: (page: number) =>
    queryOptions({
      queryKey: ['movies', 'list', parsePage(page)] as const,
      queryFn: ({ signal }) => getMovies({ page: parsePage(page), signal }),
    }),
  search: (query: string, page: number) =>
    queryOptions({
      queryKey: ['movies', 'search', query.trim(), parsePage(page)] as const,
      queryFn: ({ signal }) => searchMovies({ query: query.trim(), page: parsePage(page), signal }),
      enabled: Boolean(query.trim()),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: ['movies', 'detail', id] as const,
      queryFn: ({ signal }) => getMovieDetail(id, signal),
      enabled: Number.isSafeInteger(id) && id > 0,
      staleTime: 5 * 60_000,
    }),
};
