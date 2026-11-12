function imageUrl(path: string | null, size: 'w500' | 'w1280'): string | null {
  return path?.startsWith('/') ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
export const getTmdbPosterUrl = (path: string | null) => imageUrl(path, 'w500');
export const getTmdbBackdropUrl = (path: string | null) => imageUrl(path, 'w1280');
