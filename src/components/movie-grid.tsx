import type { MovieCardData } from "../types/movie";
import MovieCard from "../pages/movies/movie-card";

interface MovieGridProps {
  movies: MovieCardData[];
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({
  movies,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <section className="grid grid-cols-1 gap-x-[18px] gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  );
}
