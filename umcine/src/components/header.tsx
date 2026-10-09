export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="#" className="logo">
          <span className="logo-icon">▥</span>
          <span>UMCine</span>
        </a>

        <nav className="navigation">
          <a href="#" className="nav-link active">
            영화
          </a>
          <a href="#" className="nav-link">
            검색
          </a>
          <a href="#" className="nav-link">
            내 정보
          </a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="search-button"
            aria-label="검색"
          >
            🔍
          </button>

          <button type="button" className="login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  )
}