import { describe, expect, it } from 'vitest';
import { movies } from '../data/movies';
import { sortMovies } from './movie-sort';

describe('영화 정렬', () => {
  it('기본순은 제공 데이터의 순서와 같다', () =>
    expect(sortMovies(movies, 'default')).toEqual(movies));
  it('최신순은 개봉일의 내림차순이다', () => {
    const dates = sortMovies(movies, 'newest').map((movie) => movie.releaseDate);
    expect(dates).toEqual([...dates].sort().reverse());
  });
  it('제목순은 한국어 제목 순서다', () => {
    const titles = sortMovies(movies, 'title').map((movie) => movie.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'ko')));
  });
  it('원본 데이터와 배열을 직접 수정하지 않는다', () => {
    const before = movies.map((movie) => movie.id);
    expect(sortMovies(movies, 'title')).not.toBe(movies);
    expect(movies.map((movie) => movie.id)).toEqual(before);
  });
});
