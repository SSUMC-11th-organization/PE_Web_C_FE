// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMovieRequest } from './use-movie-request';

afterEach(cleanup);

describe('비동기 요청 수명과 재시도', () => {
  it('로딩 → 성공으로 변경한다', async () => {
    const load = vi.fn().mockResolvedValue('movie');
    const { result } = renderHook(() => useMovieRequest(load));
    expect(result.current.state.status).toBe('loading');
    await waitFor(() => expect(result.current.state).toEqual({ status: 'success', data: 'movie' }));
  });
  it('실패 후 같은 요청을 다시 실행해 성공으로 전환한다', async () => {
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce('retried');
    const { result } = renderHook(() => useMovieRequest(load));
    await waitFor(() => expect(result.current.state.status).toBe('error'));
    act(() => result.current.retry());
    expect(result.current.state.status).toBe('loading');
    await waitFor(() =>
      expect(result.current.state).toEqual({ status: 'success', data: 'retried' }),
    );
    expect(load).toHaveBeenCalledTimes(2);
    expect(load.mock.calls[0]?.[0]).toBeInstanceOf(AbortSignal);
  });
  it('이전 응답이 더 늦어도 최신 검색 결과를 덮어쓰지 않는다', async () => {
    let finishOld: (value: string) => void = () => {};
    const oldLoad = vi.fn<(signal: AbortSignal) => Promise<string>>().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          finishOld = resolve;
        }),
    );
    const newLoad = vi.fn().mockResolvedValue('새 검색');
    const { result, rerender } = renderHook(({ load }) => useMovieRequest(load), {
      initialProps: { load: oldLoad },
    });
    const oldSignal = oldLoad.mock.calls[0]?.[0];
    rerender({ load: newLoad });
    await waitFor(() =>
      expect(result.current.state).toEqual({ status: 'success', data: '새 검색' }),
    );
    await act(async () => finishOld('이전 검색'));
    expect(result.current.state).toEqual({ status: 'success', data: '새 검색' });
    expect(oldSignal?.aborted).toBe(true);
  });
  it('unmount하면 요청 signal을 취소한다', () => {
    const load = vi
      .fn<(signal: AbortSignal) => Promise<string>>()
      .mockImplementation(() => new Promise<string>(() => {}));
    const { unmount } = renderHook(() => useMovieRequest(load));
    const signal = load.mock.calls[0]?.[0] as AbortSignal | undefined;
    unmount();
    expect(signal?.aborted).toBe(true);
  });
});
