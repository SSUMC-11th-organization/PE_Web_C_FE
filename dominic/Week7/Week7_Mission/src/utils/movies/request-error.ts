import { isHTTPError } from 'ky';
import { FetchHttpError } from '../../api/movies/get-movies-with-fetch';
import { TmdbResponseError } from '../../api/movies/validate-response';
import { TmdbConfigError } from '../../config/env';

export function getRequestErrorMessage(error: unknown, detail = false): string {
  if (error instanceof TmdbConfigError || error instanceof TmdbResponseError) return error.message;
  const status = isHTTPError(error)
    ? error.response.status
    : error instanceof FetchHttpError
      ? error.status
      : null;
  if (status === 401) return 'TMDB 인증에 실패했어요. API Read Access Token을 확인해 주세요.';
  if (status === 403) return '영화 데이터에 접근할 권한이 없어요.';
  if (status === 404)
    return detail ? '영화를 찾을 수 없어요.' : '요청한 영화 데이터를 찾을 수 없어요.';
  if (status === 429) return '요청이 너무 많아요. 잠시 기다린 뒤 다시 시도해 주세요.';
  if (status !== null) return 'TMDB 서버에서 응답하지 못했어요. 잠시 후 다시 시도해 주세요.';
  return '영화 정보를 불러오지 못했어요. 네트워크와 환경 변수 설정을 확인해 주세요.';
}
