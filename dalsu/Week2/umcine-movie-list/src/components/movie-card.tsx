import type { Movie } from "../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z"
        fill={filled ? "#2563eb" : "none"}
        stroke={filled ? "#2563eb" : "#374151"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrap">
        {/* posterPath는 public/images/movies 안의 파일을 가리키는 절대 경로예요 (예: /images/movies/odyssey.jpg) */}
        <img className="movie-card__poster" src={posterPath} alt={`${title} 포스터`} />
        <button
          className="movie-card__bookmark-button"
          type="button"
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <BookmarkIcon filled={isBookmarked} />
        </button>
      </div>
      <h3 className="movie-card__title">{title}</h3>
      <p className="movie-card__release-date">{releaseDate}</p>
    </article>
  );
}
