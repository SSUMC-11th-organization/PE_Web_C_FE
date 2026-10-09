import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  
  return (
    <article className="movie-card">
      <div className="overflow-hidden rounded-[10px] relative aspect-[2/3] bg-[var(--surface)]">
        <Link 
          to="/movies/$movieId" 
          params={{ movieId: String(movie.id) }}
          className ="block width-[100%] height=[100#]"
        >
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} className = "block w-full h-full object-cover"/>
        </Link>
        <button
          type="button"
          className={cn("absolute top-2 right-2 rounded-full p-2 text-white",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={movie.isBookmarked}
        >
          {/* 북마크된 영화는 채워진 아이콘, 아니면 테두리 아이콘 */}
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="icon"
          />
        </button>
      </div>
      <Link 
          to="/movies/$movieId" 
          params={{ movieId: String(movie.id) }}
          className ="text-inherit no-underline">
          <h3 className="mt-3 text-base font-bold truncate">{movie.title}</h3>
      </Link>
      
      <p className="mt-1 text-sm text-[color:var(--text-sub)]">{movie.releaseDate}</p>
    </article>
  );
}
