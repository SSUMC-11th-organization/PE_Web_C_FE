import { Link } from "@tanstack/react-router";

export function Header() {
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
          <Link to="/login" className="header__member-link">로그인</Link>
        </nav>
      </div>
    </header>
  );
}
