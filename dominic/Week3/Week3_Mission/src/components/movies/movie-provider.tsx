import { type ReactNode, useState } from 'react';
import { movies as initialMovies } from '../../data/movies';
import { MovieContext } from './movie-context';

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState(initialMovies);
  const toggleBookmark = (movieId: number) => {
    setMovies((previous) =>
      previous.map((movie) =>
        movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  };

  return <MovieContext value={{ movies, toggleBookmark }}>{children}</MovieContext>;
}
