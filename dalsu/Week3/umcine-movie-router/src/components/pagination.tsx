import { cn } from "../utils/cn";
import { ChevronIcon } from "./icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const arrowClassName =
  "flex size-9 items-center justify-center rounded-md text-ink hover:bg-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent";

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="페이지 이동">
      <button
        className={arrowClassName}
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <ChevronIcon className="size-5" direction="left" />
      </button>

      <ul className="flex items-center gap-1">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={cn(
                "flex size-9 items-center justify-center rounded-md text-sm",
                page === currentPage
                  ? "bg-ink font-bold text-white"
                  : "font-medium text-gray-600 hover:bg-gray-200",
              )}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        className={arrowClassName}
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <ChevronIcon className="size-5" direction="right" />
      </button>
    </nav>
  );
}
