import { cn } from '../../utils/cn';
import { Icon } from '../layout/icon';

export function Pagination({
  currentPage,
  onPageChange,
}: {
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav aria-label="페이지 선택" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex size-9 items-center justify-center rounded-lg border border-line bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="chevron-left" />
      </button>
      {[1, 2, 3, 4, 5].map((page) => (
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
        disabled={currentPage === 5}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex size-9 items-center justify-center rounded-lg border border-line bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="chevron-right" />
      </button>
    </nav>
  );
}
