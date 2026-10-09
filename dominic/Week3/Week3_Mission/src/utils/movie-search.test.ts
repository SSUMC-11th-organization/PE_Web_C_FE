import { describe, expect, it } from 'vitest';
import { movies } from '../data/movies';
import { cn } from './cn';
import { findMovie, searchMovies, validateMovieSearch } from './movie-search';

describe('검색어 검증', () => {
  it('누락되거나 문자열이 아닌 검색어는 빈 문자열로 처리한다', () => {
    expect(validateMovieSearch({})).toEqual({ query: '' });
    expect(validateMovieSearch({ query: 123 })).toEqual({ query: '' });
    expect(validateMovieSearch({ query: ['스파이더맨'] })).toEqual({ query: '' });
  });
  it('앞뒤 공백을 제거한다', () =>
    expect(validateMovieSearch({ query: '  스파이더맨  ' })).toEqual({ query: '스파이더맨' }));
});

describe('로컬 영화 검색', () => {
  it('한글 제목 부분 일치로 검색한다', () =>
    expect(searchMovies(movies, '스파이더맨').map((movie) => movie.id)).toEqual([1, 3]));
  it('영문 원제는 대소문자를 구분하지 않는다', () =>
    expect(searchMovies(movies, '  ODYSSEY  ').map((movie) => movie.id)).toEqual([2]));
  it('검색어가 없으면 전체 영화를 검색 결과로 노출하지 않는다', () =>
    expect(searchMovies(movies, '  ')).toEqual([]));
  it('결과가 없으면 빈 배열을 반환한다', () =>
    expect(searchMovies(movies, '없는 영화')).toEqual([]));
});

describe('동적 영화 ID', () => {
  it('존재하는 영화 ID를 찾는다', () =>
    expect(findMovie(movies, '1')?.title).toBe('스파이더맨: 브랜드 뉴 데이'));
  it.each(['999', 'abc', '0', '-1', '1.5', '01', '1e0'])('%s는 유효한 영화 ID가 아니다', (id) =>
    expect(findMovie(movies, id)).toBeUndefined(),
  );
});

describe('cn 조건부 class', () => {
  it('조건이 참인 class를 합치고 충돌하는 utility는 마지막 값으로 정한다', () =>
    expect(cn('bg-ink border-white', { hidden: false, 'bg-primary': true })).toBe(
      'border-white bg-primary',
    ));
});
