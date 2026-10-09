import type { StateStorage } from 'zustand/middleware';
import { movies } from '../data/movies';
import { localBrowserStorage } from './browser-storage';

export const BOOKMARK_PRACTICE_KEY = 'umcine-bookmarks';
const movieIds = new Set(movies.map((movie) => movie.id));

export function isMovieId(value: unknown): value is number {
  return (
    typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && movieIds.has(value)
  );
}

export function normalizeBookmarkIds(value: unknown): number[] {
  return Array.isArray(value) ? [...new Set(value.filter(isMovieId))] : [];
}

// Web Storage 직접 사용 미니 실습. 실제 화면은 bookmark-store만 사용해요.
export function readBookmarkIds(storage: StateStorage = localBrowserStorage): number[] {
  try {
    const saved = storage.getItem(BOOKMARK_PRACTICE_KEY);
    return typeof saved === 'string' ? normalizeBookmarkIds(JSON.parse(saved)) : [];
  } catch {
    return [];
  }
}

export function saveBookmarkIds(movieIds: number[], storage: StateStorage = localBrowserStorage) {
  storage.setItem(BOOKMARK_PRACTICE_KEY, JSON.stringify(normalizeBookmarkIds(movieIds)));
}
