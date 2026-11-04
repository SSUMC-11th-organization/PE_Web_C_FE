import { parsePage } from '../../utils/movies/route-search';
import { getTmdbClient } from '../tmdb-client';
import type { TmdbMovieListResponse } from './models';
import { parseMovieList } from './validate-response';

export interface GetMoviesRequest {
  page?: number;
  signal?: AbortSignal;
}
export type GetMoviesResponse = TmdbMovieListResponse;
export function getMovies({ page = 1, signal }: GetMoviesRequest = {}) {
  return getTmdbClient()
    .get('movie/popular', {
      searchParams: { language: 'ko-KR', page: parsePage(page) },
      signal,
    })
    .json<GetMoviesResponse>()
    .then(parseMovieList);
}
