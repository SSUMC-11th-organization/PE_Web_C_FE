import type { TmdbMovieListItem } from "../api/movies/models";
import Link from "../router/link";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";
import PosterImage from "./poster-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.id}`}>
        <PosterImage
          className="movie-card__poster"
          url={getTmdbPosterUrl(movie.poster_path)}
          alt={`${movie.title} 포스터`}
        />
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__date">{movie.release_date || "개봉일 미정"}</p>
      </Link>
    </article>
  );
}
