import { useState } from "react";
import { movies as initialMovies } from "./data/movies";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import "./App.css";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);

  // 불변성을 지키며 특정 영화의 북마크 상태만 토글하는 함수
  const handleToggleBookmark = (movieId: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <div className="app-container">
      <Header />
      <main>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination />
      </main>
    </div>
  );
}