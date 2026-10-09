import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./App.css";

export default function App() {
  // 영화 목록 전체를 state로 관리해서, 북마크를 누른 카드만 다시 그려지도록 해요.
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  function handleToggleBookmark(movieId: number) {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="app__content">
        <h1 className="app__title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
