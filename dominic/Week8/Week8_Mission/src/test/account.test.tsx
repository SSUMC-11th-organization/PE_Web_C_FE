// @vitest-environment jsdom
import { QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../api/account';
import { checkEmailDuplicate, checkNicknameDuplicate, signup } from '../api/members/requests';
import { getMovieDetail } from '../api/movies/get-movie-detail';
import { getMovies } from '../api/movies/get-movies';
import { getMoviesWithFetch } from '../api/movies/get-movies-with-fetch';
import { accountKeys, accountMutations, accountQueries } from '../queries/account';
import { createQueryClient } from '../queries/client';
import { routeTree } from '../routeTree.gen';
import { useAuthStore } from '../stores/auth-store';
import { detailFixture, listFixture } from './fixtures';

vi.mock('../api/account', () => ({
  login: vi.fn(),
  getMe: vi.fn(),
  updateMe: vi.fn(),
  getFavorites: vi.fn(),
  getFavorite: vi.fn(),
  changeFavorite: vi.fn(),
  getRatings: vi.fn(),
  saveRating: vi.fn(),
  deleteRating: vi.fn(),
}));
vi.mock('../api/members/requests', async (original) => ({
  ...(await original<typeof import('../api/members/requests')>()),
  signup: vi.fn(),
  checkEmailDuplicate: vi.fn(),
  checkNicknameDuplicate: vi.fn(),
}));
vi.mock('../api/movies/get-movie-detail', () => ({ getMovieDetail: vi.fn() }));
vi.mock('../api/movies/get-movies', () => ({ getMovies: vi.fn() }));
vi.mock('../api/movies/get-movies-with-fetch', () => ({ getMoviesWithFetch: vi.fn() }));
const token = `test.${btoa(JSON.stringify({ sub: '1' }))}.signature`;
const profile = {
  email: 'test@example.com',
  nickname: '도미닉',
  createdAt: '2026-11-20T00:00:00Z',
};
const rating = { ratingId: 7, movieId: 27205, score: 4, comment: '재미있어요' };
beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, session: 0 });
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  vi.mocked(api.getMe).mockResolvedValue(profile);
  vi.mocked(api.getFavorites).mockResolvedValue([]);
  vi.mocked(api.getFavorite).mockResolvedValue(false);
  vi.mocked(api.getRatings).mockResolvedValue([]);
  vi.mocked(api.login).mockResolvedValue({ accessToken: token, nickname: profile.nickname });
  vi.mocked(api.updateMe).mockResolvedValue({ ...profile, nickname: '변경닉네임' });
  vi.mocked(api.changeFavorite).mockImplementation(async (value) => value);
  vi.mocked(getMovies).mockResolvedValue(listFixture());
  vi.mocked(getMovieDetail).mockResolvedValue(detailFixture);
  vi.mocked(getMoviesWithFetch).mockResolvedValue(listFixture());
  vi.mocked(checkEmailDuplicate).mockResolvedValue(true);
  vi.mocked(checkNicknameDuplicate).mockResolvedValue(true);
  vi.mocked(signup).mockResolvedValue({
    message: '회원가입에 성공했습니다.',
    result: { memberId: 1, email: profile.email, nickname: profile.nickname },
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
async function openPage(url: string) {
  const client = createQueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [url] }),
    defaultPendingMinMs: 0,
  });
  await router.load();
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { router, client };
}
function input(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } });
}
function signedIn() {
  useAuthStore.getState().setAccessToken(token);
}

describe('인증 및 회원 화면', () => {
  it('비로그인 내 정보 직접 접근을 로그인으로 돌린다', async () => {
    const { router } = await openPage('/my/edit');
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
    expect(api.getMe).not.toHaveBeenCalled();
  });
  it('로그인 실패 시 입력을 유지하고 재시도하며 성공 후 토큰·홈·헤더를 갱신한다', async () => {
    vi.mocked(api.login).mockRejectedValueOnce(new Error('비밀번호가 올바르지 않아요.'));
    const { router } = await openPage('/login');
    input('이메일', profile.email);
    input('비밀번호', 'Test1234!');
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    await screen.findByText('비밀번호가 올바르지 않아요.');
    expect((screen.getByLabelText('비밀번호', { exact: true }) as HTMLInputElement).value).toBe(
      'Test1234!',
    );
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    await screen.findByRole('link', { name: '도미닉님' });
    expect(useAuthStore.getState().accessToken).toBe(token);
    const saved = JSON.parse(localStorage.getItem('umcine-week8-auth') ?? '{}');
    expect(saved.state).toEqual({ accessToken: token });
  });
  it('로그인 진행 중 연속 제출을 차단한다', async () => {
    let done: ((value: { accessToken: string; nickname: string }) => void) | undefined;
    vi.mocked(api.login).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          done = resolve;
        }),
    );
    await openPage('/login');
    input('이메일', profile.email);
    input('비밀번호', 'Test1234!');
    const form = screen.getByRole('button', { name: '로그인' }).closest('form');
    if (!form) throw new Error('폼 없음');
    fireEvent.submit(form);
    fireEvent.submit(form);
    await waitFor(() => expect(api.login).toHaveBeenCalledTimes(1));
    expect((screen.getByRole('button', { name: '로그인 중' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await act(async () => done?.({ accessToken: token, nickname: '도미닉' }));
  });
  it('로그인한 사용자는 /login에 접근하면 홈으로 이동한다', async () => {
    signedIn();
    const { router } = await openPage('/login');
    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
  });
  it('세션 만료 시 보호된 화면을 닫고 회원 캐시를 제거한다', async () => {
    signedIn();
    const { router, client } = await openPage('/my');
    await screen.findByText('test@example.com');
    const session = useAuthStore.getState().session;
    await act(async () => useAuthStore.getState().setAccessToken(null));
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
    expect(client.getQueryData(accountKeys.me(session))).toBeUndefined();
    expect(screen.queryByText('test@example.com')).toBeNull();
  });
  it('회원가입 mutation에서 두 중복 확인·진행 잠금·실패 입력 유지·재시도가 동작한다', async () => {
    vi.mocked(signup).mockRejectedValueOnce(new Error('이미 사용 중인 이메일입니다.'));
    await openPage('/signup');
    input('이메일', profile.email);
    input('닉네임', '도미닉');
    input('비밀번호', 'Test1234!');
    input('비밀번호 확인', 'Test1234!');
    const submit = () => screen.getByRole('button', { name: '가입하기' });
    expect((submit() as HTMLButtonElement).disabled).toBe(true);
    async function checks() {
      fireEvent.click(screen.getByRole('button', { name: '이메일 중복 확인' }));
      fireEvent.click(screen.getByRole('button', { name: '닉네임 중복 확인' }));
      await screen.findByText('사용할 수 있는 이메일이에요.');
      await screen.findByText('사용할 수 있는 닉네임이에요.');
    }
    await checks();
    fireEvent.click(submit());
    await screen.findByText('이미 사용 중인 이메일입니다.');
    expect((screen.getByLabelText('비밀번호', { exact: true }) as HTMLInputElement).value).toBe(
      'Test1234!',
    );
    await checks();
    fireEvent.click(submit());
    await screen.findByText('회원가입에 성공했습니다.');
  });
  it('내 정보의 direct 갱신은 추가 GET 없이 헤더와 조회 화면에 반영한다', async () => {
    signedIn();
    const { router } = await openPage('/my/edit');
    await screen.findByLabelText('닉네임');
    input('닉네임', '변경닉네임');
    fireEvent.click(screen.getByRole('button', { name: '수정하기' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/my'));
    await screen.findByRole('link', { name: '변경닉네임님' });
    expect(api.getMe).toHaveBeenCalledTimes(1);
  });
  it('invalidate 방식은 PATCH 성공 후 추가 GET 결과를 반영한다', async () => {
    signedIn();
    vi.mocked(api.getMe)
      .mockResolvedValueOnce(profile)
      .mockResolvedValue({ ...profile, nickname: '서버정규화' });
    await openPage('/my/edit');
    await screen.findByLabelText('닉네임');
    fireEvent.change(screen.getByLabelText('갱신 방식'), { target: { value: 'invalidate' } });
    input('닉네임', '변경닉네임');
    fireEvent.click(screen.getByRole('button', { name: '수정하기' }));
    await screen.findByRole('link', { name: '서버정규화님' });
    expect(api.getMe).toHaveBeenCalledTimes(2);
  });
  it('정보 수정 실패 시 입력을 유지하고 변경 캐시를 만들지 않는다', async () => {
    signedIn();
    vi.mocked(api.updateMe).mockRejectedValueOnce(new Error('이미 사용 중인 닉네임입니다.'));
    const { client } = await openPage('/my/edit');
    await screen.findByLabelText('닉네임');
    input('닉네임', '변경닉네임');
    fireEvent.click(screen.getByRole('button', { name: '수정하기' }));
    await screen.findByText('이미 사용 중인 닉네임입니다.');
    expect((screen.getByLabelText('닉네임') as HTMLInputElement).value).toBe('변경닉네임');
    expect(client.getQueryData(accountKeys.me(useAuthStore.getState().session))).toEqual(profile);
  });
});

describe('서버 즐겨찾기와 평점', () => {
  it('내 정보에서 서버 즐겨찾기와 삭제 결과를 동기화한다', async () => {
    signedIn();
    vi.mocked(api.getFavorites).mockResolvedValueOnce([27205]).mockResolvedValue([]);
    await openPage('/my');
    fireEvent.click(await screen.findByRole('button', { name: '인셉션 즐겨찾기 해제' }));
    await screen.findByText('아직 즐겨찾기한 영화가 없어요.');
    expect(api.changeFavorite).toHaveBeenCalledWith(
      { movieId: 27205, favorite: false },
      expect.anything(),
    );
  });
  it('상세 즐겨찾기 실패는 상태를 유지하고 재시도 후 등록을 반영한다', async () => {
    signedIn();
    vi.mocked(api.changeFavorite).mockRejectedValueOnce(new Error('잠시 후 다시 시도해 주세요.'));
    await openPage('/movies/27205');
    const button = await screen.findByRole('button', { name: '인셉션 즐겨찾기' });
    await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(button);
    await screen.findByText('잠시 후 다시 시도해 주세요.');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(button);
    await screen.findByRole('button', { name: '인셉션 즐겨찾기 해제' });
  });
  it('평점 등록 후 재조회한 결과가 수정 폼으로 바뀐다', async () => {
    signedIn();
    vi.mocked(api.getRatings).mockResolvedValueOnce([]).mockResolvedValue([rating]);
    await openPage('/movies/27205');
    fireEvent.click(await screen.findByRole('radio', { name: '4점' }));
    fireEvent.change(screen.getByRole('textbox', { name: '영화 후기 (선택)' }), {
      target: { value: rating.comment },
    });
    fireEvent.click(screen.getByRole('button', { name: '평점 등록' }));
    await screen.findByRole('button', { name: '평점 수정' });
    expect(api.saveRating).toHaveBeenCalledWith(
      { movieId: 27205, ratingId: undefined, score: 4, comment: rating.comment },
      expect.anything(),
    );
    expect(api.getRatings).toHaveBeenCalledTimes(2);
  });
  it('평점 수정·삭제 후 서버 목록과 폼을 다시 일치시킨다', async () => {
    signedIn();
    vi.mocked(api.getRatings)
      .mockResolvedValueOnce([rating])
      .mockResolvedValueOnce([{ ...rating, score: 5 }])
      .mockResolvedValue([]);
    await openPage('/movies/27205');
    fireEvent.click(await screen.findByRole('radio', { name: '5점' }));
    fireEvent.click(screen.getByRole('button', { name: '평점 수정' }));
    await waitFor(() => expect(api.getRatings).toHaveBeenCalledTimes(2));
    fireEvent.click(await screen.findByRole('button', { name: '평점 삭제' }));
    await screen.findByRole('button', { name: '평점 등록' });
    expect(api.deleteRating).toHaveBeenCalledWith(7, expect.anything());
    expect(api.getRatings).toHaveBeenCalledTimes(3);
  });
  it('즐겨찾기 조회 실패를 빈 목록으로 표시하지 않는다', async () => {
    signedIn();
    vi.mocked(api.getFavorites).mockRejectedValue(new Error('즐겨찾기 서버 오류'));
    await openPage('/my');
    await screen.findByText('즐겨찾기 서버 오류');
    expect(screen.queryByText('아직 즐겨찾기한 영화가 없어요.')).toBeNull();
  });
  it('이전 세션의 늦은 수정 응답을 새로운 회원 캐시에 반영하지 않는다', async () => {
    signedIn();
    const session = useAuthStore.getState().session;
    const client = createQueryClient();
    const options = accountMutations.updateMe(client, session, 'direct');
    useAuthStore.getState().setAccessToken('different');
    await options.onSuccess?.(
      { ...profile, nickname: '이전회원' },
      { nickname: '이전회원' },
      undefined,
      {} as never,
    );
    expect(client.getQueryData(accountKeys.me(session))).toBeUndefined();
  });
  it('세션별 Query key가 회원 정보와 즐겨찾기를 분리한다', () => {
    expect(accountQueries.me(1, true).queryKey).not.toEqual(accountQueries.me(2, true).queryKey);
    expect(accountKeys.favorites(1)).not.toEqual(accountKeys.favorites(2));
  });
});
