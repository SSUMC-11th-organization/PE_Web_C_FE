import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";
import "./movie-grid.css";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <ul className="movie-grid">
      {movies.map((movie) => (
        <li key={movie.id} className="movie-grid__item">
          <MovieCard movie={movie} onToggleBookmark={onToggleBookmark} />
        </li>
      ))}
    </ul>
  );
}
