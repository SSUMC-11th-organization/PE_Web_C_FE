export const MAX_TMDB_PAGE = 500;

export function parsePage(value: unknown): number {
  if (typeof value !== 'string' && typeof value !== 'number') return 1;
  if (typeof value === 'string' && !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 && page <= MAX_TMDB_PAGE ? page : 1;
}

export function validateMovieListSearch(search: Record<string, unknown>) {
  return { page: parsePage(search.page) };
}

export function validateMovieSearch(search: Record<string, unknown>) {
  return {
    query: typeof search.query === 'string' ? search.query.trim() : '',
    page: parsePage(search.page),
  };
}

export function parseMovieId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

export function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const total = Math.max(1, Math.min(MAX_TMDB_PAGE, totalPages));
  const start = Math.max(1, Math.min(currentPage - 2, total - 4));
  return Array.from({ length: Math.min(5, total) }, (_, index) => start + index);
}
