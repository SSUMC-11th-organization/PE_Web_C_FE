import { isHTTPError } from 'ky';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTmdbConfig, TmdbConfigError } from '../../config/env';
import { detailFixture, jsonResponse, listFixture } from '../../test/fixtures';
import { getRequestErrorMessage } from '../../utils/movies/request-error';
import { getMovieDetail } from './get-movie-detail';
import { getMovies } from './get-movies';
import { FetchHttpError, getMoviesWithFetch } from './get-movies-with-fetch';
import { searchMovies } from './search-movies';

// 인증 정보는 테스트 전용 문자열만 사용하고 실제 네트워크로 보내지 않아요.
vi.mock('../tmdb-client', async (importOriginal) => {
  const original = await importOriginal<typeof import('../tmdb-client')>();
  return {
    ...original,
    getTmdbClient: () =>
      original.createTmdbClient({
        baseUrl: 'https://api.themoviedb.org/3',
        accessToken: 'test-read-token',
      }),
  };
});
const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('VITE_TMDB_API_BASE_URL', 'https://api.themoviedb.org/3');
  vi.stubEnv('VITE_TMDB_ACCESS_TOKEN', 'test-read-token');
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('순수 fetch 실습', () => {
  it('인증 header와 한국어·page query로 요청한다', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(listFixture(2)));
    expect((await getMoviesWithFetch(2)).page).toBe(2);
    const [url, options] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toBe('https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=2');
    expect(options?.headers).toEqual({ Authorization: 'Bearer test-read-token' });
  });
  it('404 응답은 JSON보다 먼저 HTTP 오류로 처리한다', async () => {
    fetchMock.mockResolvedValueOnce(new Response('Not Found', { status: 404 }));
    await expect(getMoviesWithFetch()).rejects.toMatchObject({
      name: 'FetchHttpError',
      status: 404,
    });
  });
  it('네트워크 실패도 호출자에게 전달한다', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(getMoviesWithFetch()).rejects.toThrow('Failed to fetch');
  });
  it('잘못된 JSON 응답은 성공 데이터로 표시하지 않는다', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{broken', { status: 200 }));
    await expect(getMoviesWithFetch()).rejects.toThrow();
  });
});

describe('ky 목록·검색·상세 요청', () => {
  it('공통 인스턴스로 인기 영화 3페이지를 요청한다', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(listFixture(3)));
    expect((await getMovies({ page: 3 })).page).toBe(3);
    const request = fetchMock.mock.calls[0]?.[0] as Request;
    expect(request.method).toBe('GET');
    expect(new URL(request.url).pathname).toBe('/3/movie/popular');
    expect(new URL(request.url).searchParams.get('page')).toBe('3');
    expect(request.headers.get('Authorization')).toBe('Bearer test-read-token');
    expect(request.headers.get('Accept')).toBe('application/json');
  });
  it('검색어의 공백을 제거하고 특수문자를 안전하게 인코딩한다', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(listFixture(2)));
    await searchMovies({ query: '  인셉션 & 꿈  ', page: 2 });
    const request = fetchMock.mock.calls[0]?.[0] as Request;
    const url = new URL(request.url);
    expect(url.pathname).toBe('/3/search/movie');
    expect(url.searchParams.get('query')).toBe('인셉션 & 꿈');
    expect(url.searchParams.get('include_adult')).toBe('false');
    expect(url.searchParams.get('page')).toBe('2');
  });
  it('빈 검색어는 네트워크 요청하지 않는다', async () => {
    expect((await searchMovies({ query: '   ' })).results).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('영화 ID를 상세 path에 넣는다', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(detailFixture));
    expect((await getMovieDetail(27205)).id).toBe(27205);
    const request = fetchMock.mock.calls[0]?.[0] as Request;
    expect(new URL(request.url).pathname).toBe('/3/movie/27205');
  });
  it.each([0, -1, 1.5, NaN, Infinity])('잘못된 ID %s는 네트워크로 보내지 않는다', async (id) => {
    await expect(getMovieDetail(id)).rejects.toThrow('올바르지 않은');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('404를 HTTPError로 전달해 상세 없음 안내를 구분한다', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ status_message: 'Not found' }, 404));
    try {
      await getMovieDetail(99999999);
      expect.fail('reject해야 해요');
    } catch (error) {
      expect(isHTTPError(error)).toBe(true);
      expect(getRequestErrorMessage(error, true)).toBe('영화를 찾을 수 없어요.');
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('서버 오류를 자동 반복하지 않아 수동 재시도와 구분된다', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'error' }, 500));
    await expect(getMovies()).rejects.toMatchObject({ response: { status: 500 } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('화면을 떠날 때 요청을 중단할 수 있다', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(getMovies({ signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    });
  });
  it('형태가 잘못된 JSON은 화면 adapter에 넘기지 않는다', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ results: 'invalid' }));
    await expect(getMovies()).rejects.toThrow('형식');
  });
});

describe('환경 변수와 안전한 사용자 오류 문구', () => {
  it('토큰이 없거나 Bearer까지 붙이면 친절한 설정 오류를 낸다', () => {
    vi.stubEnv('VITE_TMDB_ACCESS_TOKEN', '');
    expect(() => getTmdbConfig()).toThrow(TmdbConfigError);
    vi.stubEnv('VITE_TMDB_ACCESS_TOKEN', 'Bearer test');
    expect(() => getTmdbConfig()).toThrow(TmdbConfigError);
  });
  it('토큰이 다른 서버로 전송되는 설정 실수를 거부한다', () => {
    vi.stubEnv('VITE_TMDB_API_BASE_URL', 'https://other.example');
    expect(() => getTmdbConfig()).toThrow('TMDB API 주소');
  });
  it.each([
    [401, '인증'],
    [403, '권한'],
    [429, '요청이 너무'],
    [500, '서버'],
  ])('%s 오류 안내를 구분한다', (status, word) =>
    expect(getRequestErrorMessage(new FetchHttpError(status as number))).toContain(word),
  );
  it('원본 오류에 인증 정보가 있어도 화면에 출력하지 않는다', () =>
    expect(getRequestErrorMessage(new Error('secret-token'))).not.toContain('secret-token'));
});
