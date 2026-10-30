import "./App.css";
import Header from "./components/header";
import TmdbAttribution from "./components/tmdb-attribution";
import MovieDetailPage from "./pages/movies/movie-detail-page";
import MovieListPage from "./pages/movies/movie-list-page";
import SearchPage from "./pages/movies/search-page";
import { useLocation } from "./router/navigation";

export default function App() {
  const { pathname } = useLocation();

  const detailMatch = pathname.match(/^\/movies\/([^/]+)$/);

  return (
    <>
      <Header />
      {pathname === "/search" ? (
        <SearchPage />
      ) : detailMatch ? (
        // key를 movieId로 주면 영화가 바뀔 때 상태가 새로 시작돼요.
        <MovieDetailPage key={detailMatch[1]} movieId={detailMatch[1]} />
      ) : (
        <MovieListPage />
      )}
      <TmdbAttribution />
    </>
  );
}
