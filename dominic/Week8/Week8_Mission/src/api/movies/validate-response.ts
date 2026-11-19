import { isRecord } from '../../utils/browser-storage';
import type { TmdbMovie, TmdbMovieDetail, TmdbMovieListResponse } from './models';

export class TmdbResponseError extends Error {
  constructor() {
    super('영화 데이터 형식이 올바르지 않아요. 잠시 후 다시 시도해 주세요.');
    this.name = 'TmdbResponseError';
  }
}

const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const isId = (value: unknown): value is number => isCount(value) && value > 0;
const isPath = (value: unknown) => value === null || typeof value === 'string';
function isMovie(value: unknown): value is TmdbMovie {
  return (
    isRecord(value) &&
    isId(value.id) &&
    ['title', 'original_title', 'overview', 'release_date'].every(
      (field) => typeof value[field] === 'string',
    ) &&
    isPath(value.poster_path) &&
    isPath(value.backdrop_path) &&
    typeof value.vote_average === 'number' &&
    Number.isFinite(value.vote_average) &&
    isCount(value.vote_count)
  );
}

// .json<T>()의 타입은 런타임 검증이 아니므로 경계에서 JSON도 검사해요.
export function parseMovieList(value: unknown): TmdbMovieListResponse {
  if (
    !isRecord(value) ||
    !isId(value.page) ||
    !isCount(value.total_pages) ||
    !isCount(value.total_results) ||
    !Array.isArray(value.results) ||
    !value.results.every(
      (movie) =>
        isMovie(movie) &&
        isRecord(movie) &&
        Array.isArray(movie.genre_ids) &&
        movie.genre_ids.every(isId),
    )
  ) {
    throw new TmdbResponseError();
  }
  return value as unknown as TmdbMovieListResponse;
}

export function parseMovieDetail(value: unknown): TmdbMovieDetail {
  if (
    !isMovie(value) ||
    !isRecord(value) ||
    !Array.isArray(value.genres) ||
    !value.genres.every(
      (genre) => isRecord(genre) && isId(genre.id) && typeof genre.name === 'string',
    ) ||
    !(value.runtime === null || isCount(value.runtime)) ||
    typeof value.tagline !== 'string'
  ) {
    throw new TmdbResponseError();
  }
  return value as unknown as TmdbMovieDetail;
}
