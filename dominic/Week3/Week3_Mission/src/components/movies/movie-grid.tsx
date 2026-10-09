import type { Movie } from '../../types/movie';
import { MovieCard } from './movie-card';

export function MovieGrid({
  movies,
  onToggleBookmark,
}: {
  movies: Movie[];
  onToggleBookmark: (id: number) => void;
}) {
  return (
    <div
      className="grid grid-cols-1 gap-x-[18px] gap-y-5 min-[480px]:grid-cols-2 min-[700px]:grid-cols-3 min-[1100px]:grid-cols-5"
      data-testid="movie-grid"
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />
      ))}
    </div>
  );
}
