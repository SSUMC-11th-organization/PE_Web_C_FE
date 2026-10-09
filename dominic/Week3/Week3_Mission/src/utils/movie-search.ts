import type { Movie } from '../types/movie';

export function validateMovieSearch(search: Record<string, unknown>): { query: string } {
  return { query: typeof search.query === 'string' ? search.query.trim() : '' };
}

export function searchMovies(movies: Movie[], query: string): Movie[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];
  return movies.filter((movie) =>
    `${movie.title} ${movie.originalTitle}`.toLocaleLowerCase().includes(normalizedQuery),
  );
}

export function findMovie(movies: Movie[], movieId: string): Movie | undefined {
  if (!/^[1-9]\d*$/.test(movieId)) return undefined;
  return movies.find((movie) => movie.id === Number(movieId));
}
