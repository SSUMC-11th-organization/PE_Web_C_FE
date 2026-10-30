import { MovieCard } from "./movie-card";
import type { TmdbMovieListItem } from "../../api/movies/models";

interface MovieGridProps {
  movies: (TmdbMovieListItem & {
    isBookmarked: boolean;
  })[];
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({
  movies,
}: MovieGridProps) {
  return (
    <section className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </section>
  );
}