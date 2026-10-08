import { create } from 'zustand';
import type { StateStorage } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { isMovieId, normalizeBookmarkIds } from '../utils/bookmark-storage';
import {
  createValidatedStorage,
  isRecord,
  localBrowserStorage,
  type StorageMode,
  sessionBrowserStorage,
} from '../utils/browser-storage';

export const BOOKMARK_STORAGE_KEY = 'umcine-bookmark-store';
export const STORAGE_MODE_KEY = 'umcine-bookmark-storage-mode';

interface BookmarkData {
  bookmarkedMovieIds: number[];
}
export interface BookmarkStore extends BookmarkData {
  storageMode: StorageMode;
  toggleBookmark: (movieId: number) => void;
  clearBookmarks: () => void;
  setStorageMode: (mode: StorageMode) => void;
}

function validateBookmarks(value: unknown): BookmarkData {
  return {
    bookmarkedMovieIds: normalizeBookmarkIds(isRecord(value) ? value.bookmarkedMovieIds : []),
  };
}

export function createBookmarkStore(
  local: StateStorage = localBrowserStorage,
  session: StateStorage = sessionBrowserStorage,
) {
  // 비교용 선택은 현재 탭에서만 유지해요. 새 탭은 기본 localStorage로 시작해요.
  const initialMode: StorageMode =
    session.getItem(STORAGE_MODE_KEY) === 'session' ? 'session' : 'local';
  const storageFor = (mode: StorageMode) =>
    createValidatedStorage(mode === 'session' ? session : local, validateBookmarks);

  const store = create<BookmarkStore>()(
    persist(
      (set, get) => ({
        bookmarkedMovieIds: [],
        storageMode: initialMode,
        toggleBookmark: (movieId) => {
          if (!isMovieId(movieId)) return;
          set((state) => ({
            bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
              ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
              : [...state.bookmarkedMovieIds, movieId],
          }));
        },
        clearBookmarks: (): void => {
          set({ bookmarkedMovieIds: [] });
          // 현재 선택한 저장소의 이 미션 key만 삭제해요. 다른 앱 데이터는 건드리지 않아요.
          store.persist.clearStorage();
        },
        setStorageMode: (mode: StorageMode): void => {
          if ((mode !== 'local' && mode !== 'session') || mode === get().storageMode) return;
          // 먼저 대상 저장소를 복원해요. 빈 배열을 먼저 set하면 기존 북마크를 덮어쓰게 돼요.
          store.persist.setOptions({ storage: storageFor(mode) });
          void store.persist.rehydrate();
          session.setItem(STORAGE_MODE_KEY, mode);
          set({ storageMode: mode });
        },
      }),
      {
        name: BOOKMARK_STORAGE_KEY,
        storage: storageFor(initialMode),
        partialize: (state) => ({ bookmarkedMovieIds: state.bookmarkedMovieIds }),
        // 저장값에 임의의 action이 들어 있어도 실제 함수를 덮어쓰지 않아요.
        merge: (saved, current) => ({ ...current, ...validateBookmarks(saved) }),
      },
    ),
  );
  return store;
}

export const useBookmarkStore = createBookmarkStore();
