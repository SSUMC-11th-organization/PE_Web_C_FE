import { Link } from '@tanstack/react-router';
import type { Movie } from '../../types/movie';
import { BookmarkButton } from './bookmark-button';

export function MovieCard({ movie }: { movie: Movie }) {
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
        <BookmarkButton movie={movie} iconOnly />
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
