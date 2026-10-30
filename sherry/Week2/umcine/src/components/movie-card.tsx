import type { Movie } from "../types/movie"

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <button
          type="button"
          className="bookmark-button"
          aria-label={`${movie.title} 북마크 변경`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          {movie.isBookmarked ? "★" : "☆"}
        </button>
      </div>

      <h2 className="movie-title">{movie.title}</h2>
      <p className="movie-original-title">{movie.originalTitle}</p>
      <p className="movie-release-date">{movie.releaseDate}</p>
    </article>
  )
}