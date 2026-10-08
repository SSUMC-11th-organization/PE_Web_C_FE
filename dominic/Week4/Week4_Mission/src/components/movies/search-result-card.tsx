import { Link } from '@tanstack/react-router';
import type { Movie } from '../../types/movie';
import { Icon } from '../layout/icon';
import { BookmarkButton } from './bookmark-button';

export function SearchResultCard({ movie }: { movie: Movie }) {
  return (
    <article
      className="flex min-w-0 gap-4 border-b border-line py-5 sm:min-h-[240px] sm:gap-[18px]"
      data-testid="search-result"
    >
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        aria-label={`${movie.title} 포스터 상세 보기`}
        className="shrink-0 overflow-hidden rounded-[10px]"
      >
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[150px] w-[100px] object-cover sm:h-[190px] sm:w-[126px]"
        />
      </Link>
      <div className="min-w-0 flex-1 pt-1">
        <h3 className="text-base leading-[24.3px] font-bold sm:text-lg">
          <Link
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
            className="hover:underline"
          >
            {movie.title}
          </Link>
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-subtle">
          <span>{movie.originalTitle}</span>
          <span>{movie.releaseDate}</span>
        </div>
        <p className="mt-2 min-h-[66px] text-[12.5px] leading-[20.25px] text-muted">
          {movie.overview}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Link
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
            aria-label={`${movie.title} 상세 보기`}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline"
          >
            상세 보기 <Icon name="arrow-right" small />
          </Link>
          <BookmarkButton movie={movie} />
        </div>
      </div>
    </article>
  );
}
