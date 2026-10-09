import { useState } from 'react';

interface HeaderProps {
  genres: string[];
  searchQuery: string;
  selectedGenre: string;
  onSearchChange: (query: string) => void;
  onGenreChange: (genre: string) => void;
}

export function Header({
  genres,
  searchQuery,
  selectedGenre,
  onSearchChange,
  onGenreChange,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#movie-list" aria-label="UMCine 영화 목록으로 이동">
          <span className="brand-symbol">
            <img src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </a>
        <nav className="main-nav" aria-label="주 메뉴">
          <a className="active" href="#movie-list" aria-current="page">
            영화
          </a>
          <button
            className="search-nav-button"
            type="button"
            onClick={() => setIsSearchOpen((open) => !open)}
            aria-expanded={isSearchOpen}
          >
            검색
          </button>
          <span>내 정보</span>
        </nav>
        <div className="header-actions">
          <button
            className="search-control"
            type="button"
            aria-label="영화 검색 열기"
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen((open) => !open)}
          >
            <img src="/icons/search.svg" alt="" />
          </button>
          <span className="login-control">로그인</span>
        </div>
      </div>
      {isSearchOpen && (
        <search className="search-panel">
          <label className="search-field">
            <span>영화 제목</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="영화 제목 검색"
            />
          </label>
          <label className="genre-field">
            <span>장르</span>
            <select value={selectedGenre} onChange={(event) => onGenreChange(event.target.value)}>
              <option value="전체">전체 장르</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>
        </search>
      )}
    </header>
  );
}
