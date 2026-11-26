interface Props { page: number; totalPages: number; onChange: (page: number) => void }
export function Pagination({ page, totalPages, onChange }: Props) {
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);
  return <nav className="cinema-pagination" aria-label="영화 목록 페이지">
    <button disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="이전 페이지">‹</button>
    {pages.map((n) => <button key={n} onClick={() => onChange(n)} aria-current={page === n ? "page" : undefined}>{n}</button>)}
    <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="다음 페이지">›</button>
  </nav>;
}
