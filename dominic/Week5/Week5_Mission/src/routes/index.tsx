import { createFileRoute } from '@tanstack/react-router';
import { MovieListPage } from '../pages/movies/movie-list-page';
import { validateMovieListSearch } from '../utils/movies/route-search';

export const Route = createFileRoute('/')({
  validateSearch: validateMovieListSearch,
  component: function MovieListRoute() {
    const { page } = Route.useSearch();
    return <MovieListPage key={page} page={page} />;
  },
});
