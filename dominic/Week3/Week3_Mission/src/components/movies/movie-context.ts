import { createContext, useContext } from 'react';
import type { Movie } from '../../types/movie';

export interface MovieContextValue {
  movies: Movie[];
  toggleBookmark: (movieId: number) => void;
}

export const MovieContext = createContext<MovieContextValue | null>(null);

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) throw new Error('MovieProvider가 필요합니다.');
  return context;
}
