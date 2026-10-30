import type { TmdbMovie, TmdbMovieDetail } from '../../api/movies/models';
import type { Movie, MovieDetail } from '../../types/movie';
import { getTmdbBackdropUrl, getTmdbPosterUrl } from './tmdb-image';

export function toMovie(movie: TmdbMovie): Movie {
  return {
    id: movie.id,
    title: movie.title || movie.original_title || '제목 정보 없음',
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    overview: movie.overview || '줄거리 정보가 없어요.',
    posterPath: getTmdbPosterUrl(movie.poster_path),
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path),
  };
}
export function formatRuntime(minutes: number | null): string {
  if (minutes === null || minutes <= 0) return '상영 시간 정보가 없어요.';
  const hours = Math.floor(minutes / 60),
    remainder = minutes % 60;
  return [hours > 0 ? `${hours}시간` : '', remainder > 0 ? `${remainder}분` : '']
    .filter(Boolean)
    .join(' ');
}
export function toMovieDetail(movie: TmdbMovieDetail): MovieDetail {
  return {
    ...toMovie(movie),
    genres: movie.genres.map((genre) => genre.name),
    runtime: formatRuntime(movie.runtime),
    tagline: movie.tagline || '영화 소개',
  };
}
