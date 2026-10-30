import { createFileRoute } from '@tanstack/react-router';
import { MovieSearchPage } from '../pages/movies/movie-search-page';
import { validateMovieSearch } from '../utils/movies/route-search';

export const Route = createFileRoute('/search')({
  validateSearch: validateMovieSearch,
  component: function SearchRoute() {
    const { query, page } = Route.useSearch();
    return <MovieSearchPage key={JSON.stringify([query, page])} query={query} page={page} />;
  },
});
