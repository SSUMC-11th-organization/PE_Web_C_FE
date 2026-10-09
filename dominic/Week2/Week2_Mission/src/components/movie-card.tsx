import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <img className="movie-poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          className={`bookmark-button${movie.isBookmarked ? ' selected' : ''}`}
          type="button"
          aria-label={`${movie.title} 북마크 ${movie.isBookmarked ? '해제' : '추가'}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
          />
        </button>
      </div>
      <div className="movie-info">
        <h2 title={movie.title}>{movie.title}</h2>
        <p>{movie.releaseDate}</p>
      </div>
    </article>
  );
}
