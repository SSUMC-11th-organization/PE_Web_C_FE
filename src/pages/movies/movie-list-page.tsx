import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";
// import "../../App.css"

export function MovieListPage()
{
    const [movies, setMovies] = useState(initialMovies);

    const handleToggleBookmark = (movieId: number) => {
        setMovies((prev) =>
        prev.map((movie) =>
            movie.id === movieId
            ? { ...movie, isBookmarked: !movie.isBookmarked }
            : movie,
        ),
        );
    };

    return (
    <div className="movies-page">
      
      <main className="movies-page__main">
        <h2 className="movies-page__title">영화 목록</h2>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      </main>
    </div>
  )
}