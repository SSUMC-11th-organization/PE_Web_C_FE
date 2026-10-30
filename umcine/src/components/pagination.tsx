export default function Pagination() {
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" aria-label="이전 페이지">
        &lt;
      </button>

      <button type="button" className="active">
        1
      </button>

      <button type="button">2</button>
      <button type="button">3</button>

      <button type="button" aria-label="다음 페이지">
        &gt;
      </button>
    </nav>
  )
}