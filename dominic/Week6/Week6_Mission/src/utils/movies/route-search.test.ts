import { describe, expect, it } from 'vitest';
import {
  getPageNumbers,
  parseMovieId,
  parsePage,
  validateMovieListSearch,
  validateMovieSearch,
} from './route-search';

describe('URL 검색어·페이지 검증', () => {
  it('누락과 잘못된 검색어는 빈 검색어, 페이지는 1로 정한다', () => {
    expect(validateMovieSearch({})).toEqual({ query: '', page: 1 });
    expect(validateMovieSearch({ query: ['a'], page: [] })).toEqual({ query: '', page: 1 });
  });
  it('검색어를 trim하고 페이지를 유지한다', () =>
    expect(validateMovieSearch({ query: '  인셉션 ', page: '3' })).toEqual({
      query: '인셉션',
      page: 3,
    }));
  it('목록도 URL의 페이지를 읽는다', () =>
    expect(validateMovieListSearch({ page: '2' })).toEqual({ page: 2 }));
  it.each([
    undefined,
    null,
    [],
    {},
    '',
    'abc',
    '0',
    '-1',
    '1.5',
    '01',
    '1e2',
    '501',
    501,
    Infinity,
    NaN,
  ])('%s는 안전한 기본 페이지로 정규화한다', (value) => expect(parsePage(value)).toBe(1));
  it.each([1, 2, 500, '1', '500'])('%s 페이지는 그대로 사용한다', (value) =>
    expect(parsePage(value)).toBe(Number(value)),
  );
});
describe('상세 ID와 페이지 버튼 범위', () => {
  it('실제 TMDB ID를 읽는다', () => expect(parseMovieId('27205')).toBe(27205));
  it.each(['abc', '0', '-1', '1.5', '01', '1e2', '9007199254740992'])(
    '%s 상세 ID를 거부한다',
    (value) => expect(parseMovieId(value)).toBeNull(),
  );
  it('중간 페이지 중심으로 최대 5개를 표시한다', () =>
    expect(getPageNumbers(9, 20)).toEqual([7, 8, 9, 10, 11]));
  it('첫/마지막 페이지에 맞게 버튼 범위를 조절한다', () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(getPageNumbers(20, 20)).toEqual([16, 17, 18, 19, 20]);
    expect(getPageNumbers(500, 1000)).toEqual([496, 497, 498, 499, 500]);
  });
});
