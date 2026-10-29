import type { TmdbMovieListItem } from "../../api/movies/models";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="movie-card">
      <div className="overflow-hidden rounded-[10px] relative aspect-[2/3] bg-[var(--surface)]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block w-full h-full"
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="block w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton movieId={movie.id} />
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="text-inherit no-underline"
      >
        <h3 className="mt-3 text-base font-bold truncate">
          {movie.title}
        </h3>
      </Link>

      <p className="mt-1 text-sm text-[color:var(--text-sub)]">
        {movie.release_date}
      </p>
    </article>
  );
}