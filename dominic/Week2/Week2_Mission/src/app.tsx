import { useState } from 'react';
import { Header } from './components/header';
import { MovieGrid } from './components/movie-grid';
import { Pagination } from './components/pagination';
import { movies as initialMovies } from './data/movies';
import type { Movie } from './types/movie';
import './app.css';

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('전체');
  const genres = [...new Set(movies.flatMap((movie) => movie.genres))].sort();
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const visibleMovies = movies.filter((movie) => {
    const matchesSearch = `${movie.title} ${movie.originalTitle}`
      .toLocaleLowerCase()
      .includes(normalizedQuery);
    const matchesGenre = selectedGenre === '전체' || movie.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const toggleBookmark = (id: number) => {
    setMovies((previous) =>
      previous.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  };

  return (
    <div className="app-shell">
      <Header
        genres={genres}
        searchQuery={searchQuery}
        selectedGenre={selectedGenre}
        onSearchChange={setSearchQuery}
        onGenreChange={setSelectedGenre}
      />
      <main id="movie-list" className="main-content">
        <h1>영화 목록</h1>
        {visibleMovies.length > 0 ? (
          <MovieGrid movies={visibleMovies} onToggleBookmark={toggleBookmark} />
        ) : (
          <p className="empty-state">조건에 맞는 영화가 없습니다.</p>
        )}
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </main>
      <footer className="site-footer">
        <a
          href="https://www.themoviedb.org/?language=ko"
          target="_blank"
          rel="noreferrer"
          aria-label="TMDB 웹사이트"
        >
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        </a>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </div>
  );
}

export default App;
