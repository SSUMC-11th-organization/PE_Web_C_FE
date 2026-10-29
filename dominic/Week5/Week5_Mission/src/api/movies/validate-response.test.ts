import { describe, expect, it } from 'vitest';
import { detailFixture, listFixture, movieFixture } from '../../test/fixtures';
import { parseMovieDetail, parseMovieList, TmdbResponseError } from './validate-response';

describe('서버 응답 런타임 검증', () => {
  it('정상 목록과 상세를 읽는다', () => {
    expect(parseMovieList(listFixture()).results[0]).toEqual(movieFixture);
    expect(parseMovieDetail(detailFixture)).toEqual(detailFixture);
  });
  it('빈 목록과 null 이미지는 정상 값이다', () => {
    expect(
      parseMovieList({ page: 1, results: [], total_pages: 0, total_results: 0 }).results,
    ).toEqual([]);
    expect(
      parseMovieDetail({ ...detailFixture, poster_path: null, backdrop_path: null, runtime: null })
        .runtime,
    ).toBeNull();
  });
  it.each([
    null,
    [],
    {},
    { results: null },
    { ...listFixture(), page: 0 },
    { ...listFixture(), total_pages: '3' },
    { ...listFixture(), results: [{ ...movieFixture, id: '27205' }] },
    { ...listFixture(), results: [{ ...movieFixture, genre_ids: null }] },
  ])('잘못된 목록 %j는 거부한다', (value) =>
    expect(() => parseMovieList(value)).toThrow(TmdbResponseError),
  );
  it.each([
    { ...detailFixture, genres: null },
    { ...detailFixture, runtime: -1 },
    { ...detailFixture, genres: [{ id: 1 }] },
    { ...detailFixture, title: null },
  ])('잘못된 상세 %j는 거부한다', (value) =>
    expect(() => parseMovieDetail(value)).toThrow(TmdbResponseError),
  );
});
