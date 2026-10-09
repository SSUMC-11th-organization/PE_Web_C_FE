import { describe, expect, it } from 'vitest';
import {
  BOOKMARK_PRACTICE_KEY,
  normalizeBookmarkIds,
  readBookmarkIds,
  saveBookmarkIds,
} from './bookmark-storage';
import { createTestStorage } from './test-storage';

describe('미니 실습: JSON으로 북마크 ID 읽고 쓰기', () => {
  it('저장되지 않은 값은 빈 배열이다', () =>
    expect(readBookmarkIds(createTestStorage())).toEqual([]));
  it('숫자 배열을 문자열로 저장하고 다시 읽는다', () => {
    const storage = createTestStorage();
    saveBookmarkIds([1, 3], storage);
    expect(storage.getItem(BOOKMARK_PRACTICE_KEY)).toBe('[1,3]');
    expect(readBookmarkIds(storage)).toEqual([1, 3]);
  });
  it.each(['{broken', 'null', '{}', '"1"'])('잘못된 값 %s는 빈 배열이다', (saved) =>
    expect(readBookmarkIds(createTestStorage({ [BOOKMARK_PRACTICE_KEY]: saved }))).toEqual([]),
  );
  it('잘못된 타입, 존재하지 않는 ID와 중복을 제거한다', () =>
    expect(normalizeBookmarkIds([1, '2', -1, 0, 2.5, 999, 1, 3, null])).toEqual([1, 3]));
});
