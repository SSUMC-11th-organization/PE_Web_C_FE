import { getTmdbClient } from '../tmdb-client';
import type { TmdbMovieDetail } from './models';
import { parseMovieDetail } from './validate-response';

export type GetMovieDetailResponse = TmdbMovieDetail;
export function getMovieDetail(movieId: number, signal?: AbortSignal) {
  if (!Number.isSafeInteger(movieId) || movieId <= 0)
    return Promise.reject(new Error('올바르지 않은 영화 번호예요.'));
  return getTmdbClient()
    .get(`movie/${movieId}`, { searchParams: { language: 'ko-KR' }, signal })
    .json<GetMovieDetailResponse>()
    .then(parseMovieDetail);
}
