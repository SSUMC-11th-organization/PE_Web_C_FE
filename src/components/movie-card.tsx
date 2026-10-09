import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="poster-container">
        <img src={movie.posterPath} alt={movie.title} />
        <button 
          className="bookmark-btn" 
          onClick={() => onToggleBookmark(movie.id)}
          aria-label="북마크 토글"
        >
          
          <img 
            src={movie.isBookmarked ? "/icons/bookmark-outline.svg" : "/icons/bookmark.svg"} 
            alt="북마크 아이콘" 
          />
        </button>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.releaseDate}</p>
      </div>
    </div>
  );
}