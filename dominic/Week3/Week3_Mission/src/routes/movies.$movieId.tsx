import { createFileRoute } from '@tanstack/react-router';
import { MovieDetailPage } from '../pages/movies/movie-detail-page';

export const Route = createFileRoute('/movies/$movieId')({
  component: function MovieDetailRoute() {
    const { movieId } = Route.useParams();
    return <MovieDetailPage movieId={movieId} />;
  },
});
