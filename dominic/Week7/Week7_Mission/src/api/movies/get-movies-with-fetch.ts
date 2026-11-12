import { getTmdbConfig } from '../../config/env';
import { parsePage } from '../../utils/movies/route-search';
import type { TmdbMovieListResponse } from './models';
import { parseMovieList } from './validate-response';

export class FetchHttpError extends Error {
  readonly status: number;
  constructor(status: number) {
    super(`인기 영화 요청에 실패했어요. (HTTP ${status})`);
    this.name = 'FetchHttpError';
    this.status = status;
  }
}

export async function getMoviesWithFetch(
  page = 1,
  signal?: AbortSignal,
): Promise<TmdbMovieListResponse> {
  const config = getTmdbConfig();
  const query = new URLSearchParams({ language: 'ko-KR', page: String(parsePage(page)) });
  const response = await fetch(`${config.baseUrl}/movie/popular?${query}`, {
    headers: { Authorization: `Bearer ${config.accessToken}` },
    signal,
  });
  // fetch는 404/500만으로 reject하지 않아요. JSON을 읽기 전에 검사해요.
  if (!response.ok) throw new FetchHttpError(response.status);
  const json: unknown = await response.json();
  return parseMovieList(json);
}
