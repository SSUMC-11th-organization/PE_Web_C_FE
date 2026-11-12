import { useState } from "react";
import MovieGrid from "./components/movie-grid";
import { movies as initialMovies } from "./data/movies";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <>
      <main className="mx-auto min-h-[720px] max-w-7xl px-6 py-9">
        <h1 className="mb-6 text-3xl font-extrabold text-gray-900">
          영화 목록
        </h1>
        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>

      <footer className="border-t border-gray-200 bg-white px-6 py-6 text-center text-xs text-gray-500">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </>
  );
}