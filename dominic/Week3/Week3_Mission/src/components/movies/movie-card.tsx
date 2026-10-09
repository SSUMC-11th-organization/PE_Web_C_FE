import { Link } from '@tanstack/react-router';
import type { Movie } from '../../types/movie';
import { cn } from '../../utils/cn';
import { Icon } from '../layout/icon';

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="min-w-0" data-testid="movie-card">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
          className="block overflow-hidden rounded-[10px]"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-[274px] w-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={`${movie.title} 즐겨찾기`}
          aria-pressed={movie.isBookmarked}
          className={cn(
            'absolute top-2.5 right-2.5 flex size-[34px] items-center justify-center rounded-lg border border-white bg-ink',
            movie.isBookmarked && 'border-primary bg-primary',
          )}
        >
          <Icon name={movie.isBookmarked ? 'bookmark' : 'bookmark-outline'} inverted />
        </button>
      </div>
      <h2 className="mt-[9px] truncate text-sm leading-[17px] font-extrabold">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="hover:underline"
        >
          {movie.title}
        </Link>
      </h2>
      <p className="mt-1 text-xs text-subtle">{movie.releaseDate}</p>
    </article>
  );
}
