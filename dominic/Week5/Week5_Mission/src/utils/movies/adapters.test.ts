import { describe, expect, it } from 'vitest';
import { detailFixture, movieFixture } from '../../test/fixtures';
import { sortMovies } from '../movie-sort';
import { formatRuntime, toMovie, toMovieDetail } from './adapters';
import { getTmdbBackdropUrl, getTmdbPosterUrl } from './tmdb-image';

describe('TMDB 응답 → 화면 adapter', () => {
  it('ID와 UI 필드를 유지하면서 포스터를 완전한 URL로 바꾼다', () => {
    expect(toMovie(movieFixture)).toMatchObject({
      id: 27205,
      title: '인셉션',
      originalTitle: 'Inception',
      releaseDate: '2010-07-15',
      posterPath: 'https://image.tmdb.org/t/p/w500/poster.jpg',
    });
    expect(toMovie(movieFixture)).not.toHaveProperty('isBookmarked');
  });
  it('null 이미지는 가짜 파일 대신 null로 유지한다', () => {
    expect(toMovie({ ...movieFixture, poster_path: null, backdrop_path: null })).toMatchObject({
      posterPath: null,
      backdropPath: null,
    });
    expect(getTmdbPosterUrl('')).toBeNull();
    expect(getTmdbPosterUrl('https://other.example/a')).toBeNull();
    expect(getTmdbBackdropUrl('/a.jpg')).toBe('https://image.tmdb.org/t/p/w1280/a.jpg');
  });
  it('상세의 장르와 상영시간을 변환한다', () =>
    expect(toMovieDetail(detailFixture)).toMatchObject({
      genres: ['액션', 'SF'],
      runtime: '2시간 28분',
      tagline: '당신의 꿈은 안전한가',
    }));
  it.each([
    [null, '상영 시간 정보가 없어요.'],
    [0, '상영 시간 정보가 없어요.'],
    [120, '2시간'],
    [45, '45분'],
  ])('%s분을 알맞게 표시한다', (minutes, expected) =>
    expect(formatRuntime(minutes as number | null)).toBe(expected),
  );
  it('응답 원본을 수정하지 않는다', () => {
    const copy = structuredClone(movieFixture);
    toMovie(movieFixture);
    expect(movieFixture).toEqual(copy);
  });
  it('빈 문자열 정보에 안내 문구를 제공한다', () =>
    expect(toMovieDetail({ ...detailFixture, overview: '', tagline: '' })).toMatchObject({
      overview: '줄거리 정보가 없어요.',
      tagline: '영화 소개',
    }));
  it('정렬은 현재 응답의 배열 복사본에만 적용한다', () => {
    const movies = [
      toMovie(movieFixture),
      toMovie({ ...movieFixture, id: 2, title: '가나다', release_date: '2025-01-01' }),
    ];
    expect(sortMovies(movies, 'title').map((movie) => movie.id)).toEqual([2, 27205]);
    expect(sortMovies(movies, 'newest')[0]?.id).toBe(2);
    expect(sortMovies(movies, 'default')).not.toBe(movies);
    expect(movies[0]?.id).toBe(27205);
  });
});
