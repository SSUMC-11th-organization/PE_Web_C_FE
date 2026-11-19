import { cn } from '../../utils/cn';
import { getPageNumbers, MAX_TMDB_PAGE } from '../../utils/movies/route-search';
import { Icon } from '../layout/icon';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const lastPage = Math.max(1, Math.min(MAX_TMDB_PAGE, totalPages));
  if (totalPages === 0) return null;
  return (
    <nav aria-label="페이지 선택" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.min(lastPage, currentPage - 1))}
        className="flex size-9 items-center justify-center rounded-lg border border-line bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="chevron-left" />
      </button>
      {getPageNumbers(currentPage, totalPages).map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
          className={cn(
            'size-9 rounded-lg border border-line bg-white text-sm font-bold',
            page === currentPage && 'border-ink bg-ink text-white',
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex size-9 items-center justify-center rounded-lg border border-line bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="chevron-right" />
      </button>
      <span className="ml-2 text-xs text-muted">
        {currentPage} / {lastPage}페이지
      </span>
    </nav>
  );
}
