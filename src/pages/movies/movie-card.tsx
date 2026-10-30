import { Link } from "@tanstack/react-router";
import type { MovieCardData } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: MovieCardData;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[9px] bg-gray-200">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.posterPath ? (
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="grid aspect-[2/3] w-full place-items-center text-gray-500">
              이미지 없음
            </div>
          )}
        </Link>

        <button
          type="button"
          aria-label={`${movie.title} 북마크 변경`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute right-[10px] top-[10px] grid h-[38px] w-[34px] cursor-pointer place-items-center rounded-[7px] border border-white p-0 text-[22px] text-white",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/80",
          )}
        >
          {movie.isBookmarked ? "★" : "☆"}
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <h2 className="mt-[10px] truncate text-[15px] font-bold">
          {movie.title}
        </h2>
      </Link>
      <p className="hidden">{movie.originalTitle}</p>
      <p className="mt-[5px] text-xs text-[#8a909d]">
        {movie.releaseDate}
      </p>
    </article>
  );
}
