import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setIsLoading(false);
      return;
    }

    async function loadMovie() {
      setIsLoading(true);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (isLoading) {
    return <main>영화 정보를 불러오는 중이에요.</main>;
  }

  if (errorMessage) {
    return <main>{errorMessage}</main>;
  }

    if (!movie) {
    return <main>영화 정보를 불러오지 못했어요.</main>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const runtimeText =
    movie.runtime === null
      ? "상영 시간 정보가 없어요."
      : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`;

  return (
    <main>
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-600">
            이미지 없음
          </div>
        )}
      </div>

      <Link to="/">영화 목록</Link>

      <div className="aspect-[2/3] w-[200px] overflow-hidden bg-gray-200">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-600">
            이미지 없음
          </div>
        )}
      </div>

      <h1>{movie.title}</h1>
      <p>{movie.original_title}</p>
      <p>{movie.release_date}</p>
      <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
      <p>{runtimeText}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
    </main>
  );
}