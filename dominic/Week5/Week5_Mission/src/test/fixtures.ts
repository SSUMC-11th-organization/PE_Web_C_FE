import type {
  TmdbMovieDetail,
  TmdbMovieListItem,
  TmdbMovieListResponse,
} from '../api/movies/models';

// 테스트에서만 import해요. 실제 앱은 더미 데이터로 폴백하지 않아요.
export const movieFixture: TmdbMovieListItem = {
  id: 27205,
  title: '인셉션',
  original_title: 'Inception',
  overview: '꿈속에서 시작되는 이야기',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2010-07-15',
  vote_average: 8.4,
  vote_count: 100,
  genre_ids: [28, 878],
};
export const detailFixture: TmdbMovieDetail = {
  ...movieFixture,
  genres: [
    { id: 28, name: '액션' },
    { id: 878, name: 'SF' },
  ],
  runtime: 148,
  tagline: '당신의 꿈은 안전한가',
};
export function listFixture(
  page = 1,
  results = [movieFixture],
  totalPages = 3,
): TmdbMovieListResponse {
  return { page, results, total_pages: totalPages, total_results: totalPages * 20 };
}
export const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
