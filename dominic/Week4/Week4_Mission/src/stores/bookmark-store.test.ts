import { describe, expect, it } from 'vitest';
import { createSafeStateStorage } from '../utils/browser-storage';
import { createTestStorage } from '../utils/test-storage';
import { BOOKMARK_STORAGE_KEY, createBookmarkStore, STORAGE_MODE_KEY } from './bookmark-store';

function fixtures(saved?: string) {
  const local = createTestStorage(saved === undefined ? {} : { [BOOKMARK_STORAGE_KEY]: saved });
  const session = createTestStorage();
  return { local, session, store: createBookmarkStore(local, session) };
}

describe('북마크 Zustand store', () => {
  it('저장값이 없으면 더미 데이터의 북마크와 관계없이 빈 상태로 시작한다', () => {
    const { store } = fixtures();
    expect(store.getState().bookmarkedMovieIds).toEqual([]);
    expect(store.getState().storageMode).toBe('local');
    expect(store.persist.hasHydrated()).toBe(true);
  });
  it('추가와 해제를 불변 업데이트로 처리한다', () => {
    const { store } = fixtures();
    const original = store.getState().bookmarkedMovieIds;
    store.getState().toggleBookmark(1);
    const added = store.getState().bookmarkedMovieIds;
    store.getState().toggleBookmark(1);
    expect(original).toEqual([]);
    expect(added).toEqual([1]);
    expect(store.getState().bookmarkedMovieIds).toEqual([]);
  });
  it('구독한 컴포넌트 모두가 동일한 상태 변경을 받는다', () => {
    const { store } = fixtures();
    const list: number[][] = [],
      search: number[][] = [],
      detail: number[][] = [];
    for (const observer of [list, search, detail])
      store.subscribe((state) => observer.push(state.bookmarkedMovieIds));
    store.getState().toggleBookmark(3);
    expect(list).toEqual([[3]]);
    expect(search).toEqual(list);
    expect(detail).toEqual(list);
  });
  it.each([0, -1, 1.5, 999, Number.NaN, Number.POSITIVE_INFINITY])(
    '%s ID 추가를 거부한다',
    (id) => {
      const { store } = fixtures();
      store.getState().toggleBookmark(id);
      expect(store.getState().bookmarkedMovieIds).toEqual([]);
    },
  );
  it('영화 ID만 JSON으로 저장하고 함수와 화면 설정은 저장하지 않는다', () => {
    const { store, local } = fixtures();
    store.getState().toggleBookmark(1);
    store.getState().toggleBookmark(3);
    expect(JSON.parse(local.getItem(BOOKMARK_STORAGE_KEY) ?? '')).toEqual({
      state: { bookmarkedMovieIds: [1, 3] },
      version: 0,
    });
  });
  it('앱을 새로 만들면 같은 localStorage에서 북마크를 복원한다', () => {
    const { store, local } = fixtures();
    store.getState().toggleBookmark(7);
    const reopened = createBookmarkStore(local, createTestStorage());
    expect(reopened.getState().bookmarkedMovieIds).toEqual([7]);
  });
  it('저장값을 삭제하고 앱을 다시 열면 빈 상태로 돌아간다', () => {
    const { store, local, session } = fixtures();
    store.getState().toggleBookmark(1);
    local.removeItem(BOOKMARK_STORAGE_KEY);
    expect(createBookmarkStore(local, session).getState().bookmarkedMovieIds).toEqual([]);
  });
  it.each([
    '{broken',
    'null',
    '[]',
    '123',
    '{"state":null}',
    '{"state":{"bookmarkedMovieIds":"1"}}',
    '{"state":{"bookmarkedMovieIds":[1]},"version":9}',
  ])('잘못된 저장값 %s로도 앱이 시작된다', (saved) => {
    const { store } = fixtures(saved);
    expect(store.getState().bookmarkedMovieIds).toEqual([]);
    expect(typeof store.getState().toggleBookmark).toBe('function');
  });
  it('복원 시 잘못된 ID와 중복을 제거하며 임의의 action을 무시한다', () => {
    const { store } = fixtures(
      JSON.stringify({
        state: {
          bookmarkedMovieIds: [1, '3', null, -1, 0, 2.5, 999, 1, 3],
          toggleBookmark: 'tampered',
        },
        version: 0,
      }),
    );
    expect(store.getState().bookmarkedMovieIds).toEqual([1, 3]);
    store.getState().toggleBookmark(1);
    expect(store.getState().bookmarkedMovieIds).toEqual([3]);
  });
  it('손상된 저장값 이후에도 새 북마크를 올바르게 저장한다', () => {
    const { store, local } = fixtures('{broken');
    store.getState().toggleBookmark(2);
    expect(JSON.parse(local.getItem(BOOKMARK_STORAGE_KEY) ?? '').state.bookmarkedMovieIds).toEqual([
      2,
    ]);
  });
  it('저장소 접근/쓰기/삭제가 금지돼도 메모리에서 북마크가 동작한다', () => {
    const unavailable = createSafeStateStorage(() => {
      throw new Error('SecurityError');
    });
    const store = createBookmarkStore(unavailable, unavailable);
    store.getState().toggleBookmark(1);
    expect(store.getState().bookmarkedMovieIds).toEqual([1]);
    expect(() => store.persist.clearStorage()).not.toThrow();
  });
  it('용량 초과에도 상태 변경은 반영된다', () => {
    const limited = createSafeStateStorage(() => ({
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {},
    }));
    const store = createBookmarkStore(limited, createTestStorage());
    expect(() => store.getState().toggleBookmark(1)).not.toThrow();
    expect(store.getState().bookmarkedMovieIds).toEqual([1]);
  });
});

describe('선택 미션: sessionStorage 비교', () => {
  it('초기화는 선택한 저장소의 북마크만 지우고 다른 저장소와 설정은 보존한다', () => {
    const { store, local, session } = fixtures();
    local.setItem('other-key', 'preserve');
    store.getState().toggleBookmark(1);
    store.getState().setStorageMode('session');
    store.getState().toggleBookmark(3);
    store.getState().clearBookmarks();
    expect(store.getState().bookmarkedMovieIds).toEqual([]);
    expect(session.getItem(BOOKMARK_STORAGE_KEY)).toBeNull();
    expect(session.getItem(STORAGE_MODE_KEY)).toBe('session');
    expect(local.getItem('other-key')).toBe('preserve');
    expect(JSON.parse(local.getItem(BOOKMARK_STORAGE_KEY) ?? '').state.bookmarkedMovieIds).toEqual([
      1,
    ]);
    expect(createBookmarkStore(local, session).getState().bookmarkedMovieIds).toEqual([]);
  });
  it('저장소를 바꿔도 local/session 값을 덮어쓰지 않는다', () => {
    const { store, local, session } = fixtures();
    store.getState().toggleBookmark(1);
    store.getState().setStorageMode('session');
    expect(store.getState().bookmarkedMovieIds).toEqual([]);
    store.getState().toggleBookmark(3);
    store.getState().setStorageMode('local');
    expect(store.getState().bookmarkedMovieIds).toEqual([1]);
    store.getState().setStorageMode('session');
    expect(store.getState().bookmarkedMovieIds).toEqual([3]);
    expect(JSON.parse(local.getItem(BOOKMARK_STORAGE_KEY) ?? '').state.bookmarkedMovieIds).toEqual([
      1,
    ]);
    expect(
      JSON.parse(session.getItem(BOOKMARK_STORAGE_KEY) ?? '').state.bookmarkedMovieIds,
    ).toEqual([3]);
  });
  it('같은 탭 새로고침에서는 session 모드와 값이 유지된다', () => {
    const { store, local, session } = fixtures();
    store.getState().setStorageMode('session');
    store.getState().toggleBookmark(3);
    const reloaded = createBookmarkStore(local, session);
    expect(reloaded.getState().storageMode).toBe('session');
    expect(reloaded.getState().bookmarkedMovieIds).toEqual([3]);
  });
  it('새 탭은 local 기본 모드로 시작하고 session 선택 시 빈 상태다', () => {
    const { store, local } = fixtures();
    store.getState().toggleBookmark(1);
    store.getState().setStorageMode('session');
    store.getState().toggleBookmark(3);
    const newTab = createBookmarkStore(local, createTestStorage());
    expect(newTab.getState().storageMode).toBe('local');
    expect(newTab.getState().bookmarkedMovieIds).toEqual([1]);
    newTab.getState().setStorageMode('session');
    expect(newTab.getState().bookmarkedMovieIds).toEqual([]);
  });
  it('모드 선택값이 손상되었으면 local로 시작한다', () => {
    const session = createTestStorage({ [STORAGE_MODE_KEY]: 'invalid' });
    expect(createBookmarkStore(createTestStorage(), session).getState().storageMode).toBe('local');
  });
});
