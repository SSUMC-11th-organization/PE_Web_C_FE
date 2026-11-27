import 'server-only';
import { cache } from 'react';
import { parseMovieDetail, parseMovieList } from '@/api/movies/validate-response';
import { parsePage } from '@/utils/movies/route-search';

export class TmdbUpstreamError extends Error {
  constructor(public readonly status: number) {
    super('영화 데이터를 불러오지 못했어요.');
    this.name = 'TmdbUpstreamError';
  }
}
export function isAllowedTmdbPath(path: string) {
  return /^(movie\/popular|search\/movie|movie\/[1-9]\d*)$/.test(path);
}
export async function requestTmdb(path: string, params: URLSearchParams, signal?: AbortSignal) {
  if (!isAllowedTmdbPath(path)) throw new TmdbUpstreamError(404);
  const token = process.env.TMDB_ACCESS_TOKEN?.trim();
  if (!token || token.startsWith('Bearer ') || token.includes('여기에_'))
    throw new TmdbUpstreamError(503);
  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  url.searchParams.set('language', 'ko-KR');
  if (path === 'movie/popular' || path === 'search/movie') {
    url.searchParams.set('page', String(parsePage(params.get('page'))));
    if (path === 'search/movie') {
      url.searchParams.set('query', (params.get('query') ?? '').trim().slice(0, 200));
      url.searchParams.set('include_adult', 'false');
    }
  }
  const timeout = AbortSignal.timeout(10_000);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    next: { revalidate: 300 },
    redirect: 'error',
  });
  if (!response.ok) throw new TmdbUpstreamError(response.status);
  const body: unknown = await response.json();
  return path === 'movie/popular' || path === 'search/movie'
    ? parseMovieList(body)
    : parseMovieDetail(body);
}
export const readMovieDetail = cache(async (id: number) =>
  parseMovieDetail(await requestTmdb(`movie/${id}`, new URLSearchParams())),
);
