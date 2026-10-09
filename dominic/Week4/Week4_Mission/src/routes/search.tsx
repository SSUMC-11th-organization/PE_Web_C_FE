import { createFileRoute } from '@tanstack/react-router';
import { MovieSearchPage } from '../pages/movies/movie-search-page';
import { validateMovieSearch } from '../utils/movie-search';

export const Route = createFileRoute('/search')({
  validateSearch: validateMovieSearch,
  component: function SearchRoute() {
    const { query } = Route.useSearch();
    return <MovieSearchPage query={query} />;
  },
});
