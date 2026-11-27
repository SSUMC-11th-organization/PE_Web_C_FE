import { QueryObserver } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { createQueryClient } from './client';
import { movieQueries } from './movies';

describe('Query 캐시와 요청 구분', () => {
  it('목록 페이지·검색어·상세 ID마다 key를 구분한다', () => {
    const keys = [
      movieQueries.list(1),
      movieQueries.list(2),
      movieQueries.search('a', 1),
      movieQueries.search('b', 1),
      movieQueries.search('a', 2),
      movieQueries.detail(1),
      movieQueries.detail(2),
    ].map((x) => JSON.stringify(x.queryKey));
    expect(new Set(keys).size).toBe(7);
  });
  it('빈 검색어와 잘못된 ID를 비활성화한다', () => {
    expect(movieQueries.search(' ', 1).enabled).toBe(false);
    expect(movieQueries.detail(0).enabled).toBe(false);
  });
  it('fresh 캐시를 재사용해 네트워크 호출을 줄인다', async () => {
    const client = createQueryClient(),
      queryFn = vi.fn().mockResolvedValue('movie');
    await client.fetchQuery({ queryKey: ['test'], queryFn });
    await client.fetchQuery({ queryKey: ['test'], queryFn });
    expect(queryFn).toHaveBeenCalledTimes(1);
    client.clear();
  });
  it('staleTime 0이면 다시 조회한다', async () => {
    const client = createQueryClient(),
      queryFn = vi.fn().mockResolvedValue('movie');
    await client.fetchQuery({ queryKey: ['test'], queryFn, staleTime: 0 });
    await client.fetchQuery({ queryKey: ['test'], queryFn, staleTime: 0 });
    expect(queryFn).toHaveBeenCalledTimes(2);
    client.clear();
  });
  it('비활성화된 미조회 Query는 pending이지만 loading은 아니다', () => {
    const client = createQueryClient();
    const observer = new QueryObserver(client, {
      queryKey: ['disabled'],
      queryFn: async () => 1,
      enabled: false,
    });
    expect(observer.getCurrentResult()).toMatchObject({
      isPending: true,
      isLoading: false,
      fetchStatus: 'idle',
    });
    client.clear();
  });
  it('상세는 전역 기본값보다 긴 staleTime을 적용한다', () => {
    expect(movieQueries.detail(1).staleTime).toBe(300000);
    expect(createQueryClient().getDefaultOptions().queries?.staleTime).toBe(60000);
  });
});
