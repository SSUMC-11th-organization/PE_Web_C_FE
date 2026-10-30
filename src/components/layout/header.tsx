import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-10 px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-gray-900">
            ▥
          </span>
          UMCine
        </Link>

        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">영화</Link>
          <Link to="/search" className="hover:text-gray-900">검색</Link>
          <span>내 정보</span>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/search"
            aria-label="검색"
            className="grid h-9 w-9 place-items-center rounded border border-gray-200"
          >
            🔍
          </Link>
          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}