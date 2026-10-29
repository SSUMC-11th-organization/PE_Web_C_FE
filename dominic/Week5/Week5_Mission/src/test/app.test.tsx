// @vitest-environment jsdom
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMovieDetail } from '../api/movies/get-movie-detail';
import { getMovies } from '../api/movies/get-movies';
import { FetchHttpError, getMoviesWithFetch } from '../api/movies/get-movies-with-fetch';
import { searchMovies } from '../api/movies/search-movies';
import { MovieImage } from '../components/movies/movie-image';
import { routeTree } from '../routeTree.gen';
import { useBookmarkStore } from '../stores/bookmark-store';
import { detailFixture, listFixture, movieFixture } from './fixtures';

vi.mock('../api/movies/get-movies', () => ({ getMovies: vi.fn() }));
vi.mock('../api/movies/search-movies', () => ({ searchMovies: vi.fn() }));
vi.mock('../api/movies/get-movie-detail', () => ({ getMovieDetail: vi.fn() }));
vi.mock('../api/movies/get-movies-with-fetch', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/movies/get-movies-with-fetch')>()),
  getMoviesWithFetch: vi.fn(),
}));
const getMoviesMock = vi.mocked(getMovies);
const searchMock = vi.mocked(searchMovies);
const detailMock = vi.mocked(getMovieDetail);

beforeEach(() => {
  vi.resetAllMocks();
  // jsdom에는 실제 스크롤 레이아웃이 없어 라우터의 스크롤 복원만 대체해요.
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  localStorage.clear();
  sessionStorage.clear();
  useBookmarkStore.setState({ bookmarkedMovieIds: [], storageMode: 'local' });
  getMoviesMock.mockImplementation(async ({ page = 1 } = {}) => listFixture(page));
  searchMock.mockImplementation(async ({ page = 1 }) => listFixture(page));
  detailMock.mockResolvedValue(detailFixture);
  vi.mocked(getMoviesWithFetch).mockResolvedValue(listFixture());
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function openPage(url: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [url] }),
    defaultPendingMinMs: 0,
  });
  await router.load();
  render(<RouterProvider router={router} />);
  return router;
}

describe('미션 화면 통합 검증 (메모리 라우터·모의 API)', () => {
  it('로딩을 표시한 뒤 API 목록을 카드로 렌더링한다', async () => {
    let complete: ((value: ReturnType<typeof listFixture>) => void) | undefined;
    getMoviesMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          complete = resolve;
        }),
    );
    await openPage('/');
    expect(screen.getByText('영화 정보를 불러오는 중이에요.')).toBeTruthy();
    await act(async () => complete?.(listFixture()));
    expect(await screen.findByRole('heading', { name: '인셉션' })).toBeTruthy();
    expect(screen.getByText(/This product uses the TMDB API/)).toBeTruthy();
  });
  it('목록 2페이지를 API 및 URL과 연결하고 직접 접근해도 복원한다', async () => {
    const router = await openPage('/?page=1');
    await screen.findByRole('heading', { name: '인셉션' });
    fireEvent.click(screen.getByRole('button', { name: '2페이지' }));
    await waitFor(() => expect(router.state.location.search).toMatchObject({ page: 2 }));
    await waitFor(() =>
      expect(getMoviesMock).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })),
    );
    const directUrl = router.state.location.href;
    cleanup();
    await openPage(directUrl);
    await screen.findByRole('heading', { name: '인셉션' });
    expect(getMoviesMock).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
  });
  it('검색 페이지 변경 시 검색어를 유지하고 새 검색 시 1페이지로 간다', async () => {
    const router = await openPage('/search?query=인셉션&page=2');
    await screen.findByRole('heading', { name: '인셉션' });
    fireEvent.click(screen.getByRole('button', { name: '3페이지' }));
    await waitFor(() =>
      expect(searchMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: '인셉션', page: 3 }),
      ),
    );
    fireEvent.change(screen.getByRole('searchbox', { name: '영화 제목' }), {
      target: { value: '토이스토리' },
    });
    fireEvent.click(screen.getByRole('button', { name: '다시 검색' }));
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ query: '토이스토리', page: 1 }),
    );
    await waitFor(() =>
      expect(searchMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: '토이스토리', page: 1 }),
      ),
    );
  });
  it('빈 검색어에서는 안내만 보여주고 요청하지 않는다', async () => {
    await openPage('/search?query=%20%20');
    expect(await screen.findByText('어떤 영화를 찾고 있나요?')).toBeTruthy();
    expect(searchMock).not.toHaveBeenCalled();
  });
  it('빈 검색 결과를 로딩·오류와 구분한다', async () => {
    searchMock.mockResolvedValueOnce({ page: 1, results: [], total_pages: 0, total_results: 0 });
    await openPage('/search?query=없는영화');
    expect(
      await screen.findByText('검색 결과가 없어요. 다른 영화 제목으로 검색해 보세요.'),
    ).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: '페이지 선택' })).toBeNull();
  });
  it('목록 실패 시 버튼으로 같은 페이지를 재시도한다', async () => {
    getMoviesMock.mockRejectedValueOnce(new FetchHttpError(500));
    await openPage('/?page=2');
    fireEvent.click(await screen.findByRole('button', { name: '다시 시도' }));
    expect(await screen.findByRole('heading', { name: '인셉션' })).toBeTruthy();
    expect(getMoviesMock).toHaveBeenCalledTimes(2);
    expect(getMoviesMock).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
  });
  it('검색과 상세의 재시도도 동일한 검색어·ID를 유지한다', async () => {
    searchMock.mockRejectedValueOnce(new TypeError('offline'));
    await openPage('/search?query=인셉션&page=2');
    fireEvent.click(await screen.findByRole('button', { name: '다시 시도' }));
    await screen.findByRole('heading', { name: '인셉션' });
    expect(searchMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: '인셉션', page: 2 }),
    );
    cleanup();
    detailMock.mockRejectedValueOnce(new TypeError('offline'));
    await openPage('/movies/27205');
    fireEvent.click(await screen.findByRole('button', { name: '다시 시도' }));
    await screen.findByRole('heading', { name: '인셉션' });
    expect(detailMock).toHaveBeenLastCalledWith(27205, expect.any(AbortSignal));
  });
  it('상세 URL 직접 접근으로 제목·장르·상영시간을 보여준다', async () => {
    await openPage('/movies/27205');
    expect(await screen.findByRole('heading', { name: '인셉션' })).toBeTruthy();
    expect(screen.getByText('2시간 28분')).toBeTruthy();
    expect(screen.getByText('액션 · SF')).toBeTruthy();
  });
  it('잘못된 상세 ID를 요청하지 않고 404와도 구분한다', async () => {
    await openPage('/movies/abc');
    expect(await screen.findByText('올바르지 않은 영화 번호예요.')).toBeTruthy();
    expect(detailMock).not.toHaveBeenCalled();
    cleanup();
    detailMock.mockRejectedValueOnce(new FetchHttpError(404));
    await openPage('/movies/99999999');
    expect(await screen.findByText('영화를 찾을 수 없어요.')).toBeTruthy();
  });
  it('목록·검색·상세에서 동일한 TMDB 북마크를 공유한다', async () => {
    const router = await openPage('/');
    fireEvent.click(await screen.findByRole('button', { name: '인셉션 즐겨찾기' }));
    await act(async () => router.navigate({ to: '/search', search: { query: '인셉션', page: 1 } }));
    expect(
      (await screen.findByRole('button', { name: '인셉션 즐겨찾기 해제' })).getAttribute(
        'aria-pressed',
      ),
    ).toBe('true');
    await act(async () =>
      router.navigate({ to: '/movies/$movieId', params: { movieId: '27205' } }),
    );
    fireEvent.click(await screen.findByRole('button', { name: '인셉션 즐겨찾기 해제' }));
    expect(useBookmarkStore.getState().bookmarkedMovieIds).toEqual([]);
  });
  it('순수 fetch 실습은 클릭할 때만 실행한다', async () => {
    await openPage('/');
    await screen.findByRole('heading', { name: '인셉션' });
    expect(getMoviesWithFetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('학습용 · 순수 fetch 요청 확인'));
    fireEvent.click(screen.getByRole('button', { name: 'fetch로 인기 영화 요청', hidden: true }));
    expect(await screen.findByText(/fetch 성공/)).toBeTruthy();
    expect(getMoviesWithFetch).toHaveBeenCalledTimes(1);
  });
  it('null 이미지를 회색 영역으로 대체하고 img src를 만들지 않는다', async () => {
    getMoviesMock.mockResolvedValueOnce(listFixture(1, [{ ...movieFixture, poster_path: null }]));
    await openPage('/');
    await screen.findByRole('heading', { name: '인셉션' });
    expect(screen.getByText('이미지 없음')).toBeTruthy();
    expect(document.querySelector('img[src="null"], img[src=""]')).toBeNull();
  });
  it('이미지 로드 실패 시에도 대체 영역을 유지한다', () => {
    render(
      <MovieImage
        src="https://image.tmdb.org/t/p/w500/missing.jpg"
        alt="실패한 포스터"
        className="h-40"
      />,
    );
    fireEvent.error(screen.getByAltText('실패한 포스터'));
    expect(screen.getByText('이미지 없음')).toBeTruthy();
    expect(document.querySelector('img')).toBeNull();
  });
});
