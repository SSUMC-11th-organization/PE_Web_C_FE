import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <span className="header__logo">UMCine</span>
        <Link to="/">영화</Link>
        <Link to="/search">검색</Link>
        <nav className="header__actions">
          <img src="/icons/search.svg" alt="검색" className="icon" />
          <img src="/icons/person.svg" alt="내 정보" className="icon" />
        </nav>
      </div>
    </header>
  );
}
