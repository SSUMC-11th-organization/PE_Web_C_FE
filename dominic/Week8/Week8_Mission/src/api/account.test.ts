import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMemberId, useAuthStore } from '../stores/auth-store';
import {
  changeFavorite,
  deleteRating,
  getFavorite,
  getFavorites,
  getMe,
  getRatings,
  login,
  saveRating,
  updateMe,
} from './account';

const fetchMock = vi.fn<typeof fetch>();
const json = (result: unknown, status = 200) =>
  new Response(JSON.stringify({ isSuccess: true, result }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  useAuthStore.setState({ accessToken: 'test-token', session: 1 });
});
afterEach(() => {
  vi.unstubAllGlobals();
  useAuthStore.setState({ accessToken: null, session: 0 });
});
describe('회원·즐겨찾기·평점 API 계약', () => {
  it('로그인에는 인증 헤더를 붙이지 않고 보호 요청에는 최신 토큰을 붙인다', async () => {
    fetchMock
      .mockResolvedValueOnce(json({ accessToken: 'new-token', nickname: '도미닉' }))
      .mockImplementation(async () =>
        json({ email: 'a@example.com', nickname: '도미닉', createdAt: '2026-11-20' }),
      );
    await login({ email: ' a@example.com ', password: 'Test1234!' });
    await getMe();
    expect((fetchMock.mock.calls[0][0] as Request).headers.has('Authorization')).toBe(false);
    expect((fetchMock.mock.calls[1][0] as Request).headers.get('Authorization')).toBe(
      'Bearer test-token',
    );
    useAuthStore.getState().setAccessToken('changed-token');
    await getMe();
    expect((fetchMock.mock.calls[2][0] as Request).headers.get('Authorization')).toBe(
      'Bearer changed-token',
    );
  });
  it('보호 요청의 401은 토큰을 지우고 자동 재시도하지 않는다', async () => {
    fetchMock.mockResolvedValueOnce(json(null, 401));
    await expect(getMe()).rejects.toMatchObject({ response: { status: 401 } });
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('기존 요청의 늦은 401은 새 로그인 토큰을 지우지 않는다', async () => {
    fetchMock.mockImplementationOnce(async () => {
      useAuthStore.getState().setAccessToken('new-session');
      return json(null, 401);
    });
    await expect(getMe()).rejects.toThrow();
    expect(useAuthStore.getState().accessToken).toBe('new-session');
  });
  it('닉네임 수정에는 nickname만 보내고 전체 회원 정보를 반환한다', async () => {
    let body: unknown;
    fetchMock.mockImplementationOnce(async (request) => {
      body = await (request as Request).clone().json();
      return json({ email: 'a@example.com', nickname: '새닉네임', createdAt: '2026-11-20' });
    });
    expect((await updateMe({ nickname: ' 새닉네임 ' })).nickname).toBe('새닉네임');
    expect(body).toEqual({ nickname: '새닉네임' });
    expect((fetchMock.mock.calls[0][0] as Request).method).toBe('PATCH');
  });
  it('즐겨찾기 목록·개별 상태·추가·삭제 경로를 분리한다', async () => {
    fetchMock
      .mockResolvedValueOnce(json([{ movieId: 27205 }]))
      .mockResolvedValueOnce(json({ isFavorite: true }))
      .mockResolvedValueOnce(json(null))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    expect(await getFavorites()).toEqual([27205]);
    expect(await getFavorite(27205)).toBe(true);
    await changeFavorite({ movieId: 27205, favorite: true });
    await changeFavorite({ movieId: 27205, favorite: false });
    const requests = fetchMock.mock.calls.map((call) => call[0] as Request);
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ['GET', '/favorites'],
      ['GET', '/favorites/27205'],
      ['POST', '/favorites'],
      ['DELETE', '/favorites/27205'],
    ]);
  });
  it('즐겨찾기 API 미구현 404와 잘못된 상태를 빈 목록·false로 숨기지 않는다', async () => {
    fetchMock
      .mockResolvedValueOnce(json(null, 404))
      .mockResolvedValueOnce(json({ isFavorite: 'true' }));
    await expect(getFavorites()).rejects.toThrow();
    await expect(getFavorite(1)).rejects.toThrow('형식');
  });
  it('평점에는 memberId를 쓰기 본문에 넣지 않고 score/comment만 수정한다', async () => {
    const bodies: unknown[] = [];
    fetchMock.mockImplementation(async (request) => {
      const req = request as Request;
      if (req.method === 'GET')
        return json([{ ratingId: 1, movieId: 27205, score: 4, comment: null }]);
      if (req.method !== 'DELETE') bodies.push(await req.clone().json());
      return json(null);
    });
    expect((await getRatings(3))[0]?.score).toBe(4);
    await saveRating({ movieId: 27205, score: 4 });
    await saveRating({ movieId: 27205, ratingId: 1, score: 5, comment: '수정' });
    await deleteRating(1);
    expect(bodies).toEqual([
      { movieId: 27205, score: 4, comment: null },
      { score: 5, comment: '수정' },
    ]);
    expect(fetchMock.mock.calls.map((call) => new URL((call[0] as Request).url).pathname)).toEqual([
      '/members/3/ratings',
      '/ratings',
      '/ratings/1',
      '/ratings/1',
    ]);
  });
  it('손상된 JWT의 회원 번호를 요청 경로로 사용하지 않는다', () => {
    expect(getMemberId('broken')).toBeNull();
    expect(getMemberId(`a.${btoa(JSON.stringify({ sub: '-1' }))}.b`)).toBeNull();
    expect(getMemberId(`a.${btoa(JSON.stringify({ sub: '12' }))}.b`)).toBe(12);
  });
});
