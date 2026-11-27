import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/tmdb/[...path]/route';
import { detailFixture, jsonResponse, listFixture } from '@/test/fixtures';
import { isAllowedTmdbPath, requestTmdb } from './tmdb';

vi.mock('server-only', () => ({}));
const fetcher = vi.fn<typeof fetch>();
beforeEach(() => {
  fetcher.mockReset();
  vi.stubGlobal('fetch', fetcher);
  vi.stubEnv('TMDB_ACCESS_TOKEN', 'test-server-secret');
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
const call = (path: string[], search = '') =>
  GET(new Request(`http://localhost/api/tmdb/${path.join('/')}?${search}`), {
    params: Promise.resolve({ path }),
  });

describe('server-only TMDB 경계', () => {
  it.each([
    'account',
    'authentication/token/new',
    'movie/0',
    '../account',
    'https://other.example',
    'movie/1/credits',
  ])('허용하지 않는 %s는 네트워크로 전달하지 않는다', async (path) => {
    expect(isAllowedTmdbPath(path)).toBe(false);
    expect((await call(path.split('/'))).status).toBe(404);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('토큰은 upstream 헤더에만 넣고 사용자 URL·헤더는 전달하지 않는다', async () => {
    fetcher.mockResolvedValue(jsonResponse(listFixture(2)));
    const response = await call(
      ['movie', 'popular'],
      'page=2&api_key=attacker&url=https://other.example',
    );
    expect(response.status).toBe(200);
    const [url, options] = fetcher.mock.calls[0] ?? [];
    expect(String(url)).toBe('https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=2');
    expect(options?.headers).toEqual({
      Authorization: 'Bearer test-server-secret',
      Accept: 'application/json',
    });
    expect(await response.text()).not.toContain('test-server-secret');
  });
  it('검색 특수문자를 인코딩하고 성인 포함 여부를 서버가 제한한다', async () => {
    fetcher.mockResolvedValue(jsonResponse(listFixture()));
    await requestTmdb(
      'search/movie',
      new URLSearchParams({ query: '꿈 & 모험', include_adult: 'true', page: '-3' }),
    );
    const url = new URL(String(fetcher.mock.calls[0]?.[0]));
    expect(url.searchParams.get('query')).toBe('꿈 & 모험');
    expect(url.searchParams.get('include_adult')).toBe('false');
    expect(url.searchParams.get('page')).toBe('1');
  });
  it('상세 응답은 런타임 검증 후 반환한다', async () => {
    fetcher.mockResolvedValue(jsonResponse(detailFixture));
    expect(await requestTmdb('movie/27205', new URLSearchParams())).toEqual(detailFixture);
    fetcher.mockResolvedValue(jsonResponse({ id: 27205 }));
    expect((await call(['movie', '27205'])).status).toBe(502);
  });
  it('서버 비밀이 없으면 요청하지 않고 안전한 503을 반환한다', async () => {
    vi.stubEnv('TMDB_ACCESS_TOKEN', '');
    expect((await call(['movie', 'popular'])).status).toBe(503);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('upstream 오류의 인증정보·본문을 사용자에게 출력하지 않는다', async () => {
    fetcher.mockResolvedValue(new Response('test-server-secret', { status: 401 }));
    const response = await call(['movie', 'popular']);
    expect(response.status).toBe(401);
    expect(await response.text()).not.toContain('test-server-secret');
  });
});
