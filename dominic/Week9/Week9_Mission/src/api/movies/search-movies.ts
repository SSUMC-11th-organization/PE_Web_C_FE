import { parsePage } from '../../utils/movies/route-search';
import { getTmdbClient } from '../tmdb-client';
import type { TmdbMovieListResponse } from './models';
import { parseMovieList } from './validate-response';

export interface SearchMoviesRequest {
  query: string;
  page?: number;
  signal?: AbortSignal;
}
export type SearchMoviesResponse = TmdbMovieListResponse;
export function searchMovies({ query, page = 1, signal }: SearchMoviesRequest) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery)
    return Promise.resolve<SearchMoviesResponse>({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    });
  return getTmdbClient()
    .get('search/movie', {
      searchParams: {
        query: normalizedQuery,
        page: parsePage(page),
        language: 'ko-KR',
        include_adult: false,
      },
      signal,
    })
    .json<SearchMoviesResponse>()
    .then(parseMovieList);
}
