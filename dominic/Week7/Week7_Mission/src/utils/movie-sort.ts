import type { SortOrder } from '../stores/view-settings-store';
import type { Movie } from '../types/movie';

export function sortMovies(movies: Movie[], order: SortOrder): Movie[] {
  const result = [...movies];
  if (order === 'title') return result.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  if (order === 'newest') return result.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  return result;
}
