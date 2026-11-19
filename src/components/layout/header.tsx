import { Link } from "@tanstack/react-router";

import { useMeQuery } from "../../hooks/use-member-queries";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo" aria-label="UMCine 홈">
          <span className="header__brand-mark"><img src="/icons/movie.svg" alt="" /></span>
          <span>UMCine</span>
        </Link>
        <nav className="header__nav" aria-label="주 메뉴">
          <Link to="/" activeOptions={{ exact: true }}>영화</Link>
          <Link to="/search">검색</Link>
          <Link to="/members">내 정보</Link>
        </nav>
        <nav className="header__actions" aria-label="빠른 메뉴">
          <Link to="/search" className="header__icon-link" aria-label="영화 검색">
            <img src="/icons/search.svg" alt="" className="icon" />
          </Link>
          {!accessToken ? (
            <Link to="/login" className="header__member-link">
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link to="/members" className="header__member-link">
              마이페이지
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
