import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { BookmarkIcon } from "../icons";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

  return (
    <article className="flex flex-col">
      <div className="relative aspect-[22/25] overflow-hidden rounded-lg bg-gray-200">
        {/* 북마크 버튼은 링크 안에 넣을 수 없어서, 포스터 이미지만 Link로 감싸요 */}
        <Link to="/movies/$movieId" params={{ movieId: String(id) }} className="block size-full">
          <img
            className="size-full object-cover transition-transform duration-300 hover:scale-105"
            src={posterPath}
            alt={`${title} 포스터`}
          />
        </Link>
        <button
          className={cn(
            "absolute right-2.5 top-2.5 flex size-9 items-center justify-center rounded-lg border text-white",
            isBookmarked ? "border-blue-600 bg-blue-600" : "border-white/80 bg-black/60 hover:bg-black/75",
          )}
          type="button"
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <BookmarkIcon className="size-5" filled={isBookmarked} />
        </button>
      </div>
      <h3 className="mt-2.5 truncate text-[15px] font-bold text-ink">
        <Link to="/movies/$movieId" params={{ movieId: String(id) }} className="hover:underline">
          {title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-gray-400">{releaseDate}</p>
    </article>
  );
}
