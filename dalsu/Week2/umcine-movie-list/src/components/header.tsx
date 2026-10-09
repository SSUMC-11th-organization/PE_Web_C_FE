import "./header.css";

function LogoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 5v4M14 5v4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <a className="header__logo" href="/">
            <LogoIcon />
            <span>UMCine</span>
          </a>
          <nav className="header__nav">
            <a className="header__nav-link header__nav-link--active" href="/movies">
              영화
            </a>
            <a className="header__nav-link" href="/search">
              검색
            </a>
            <a className="header__nav-link" href="/profile">
              내 정보
            </a>
          </nav>
        </div>
        <div className="header__right">
          <button className="header__icon-button" type="button" aria-label="검색">
            <SearchIcon />
          </button>
          <button className="header__login-button" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
