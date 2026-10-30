import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import PosterImage from "../../components/poster-image";
import StatusMessage from "../../components/status-message";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieDetailPageProps {
  movieId: string;
}

export default function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setMovie(null);

    if (!isValidMovieId) {
      setErrorMessage("올바르지 않은 영화 번호예요.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isValidMovieId, parsedMovieId]);

  if (isLoading) {
    return (
      <main className="page">
        <StatusMessage kind="loading" message="영화 정보를 불러오는 중이에요." />
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="page">
        <StatusMessage kind="error" message={errorMessage ?? "영화 정보를 불러오지 못했어요."} />
      </main>
    );
  }

  return (
    <main className="page detail">
      <PosterImage
        className="detail__backdrop"
        url={getTmdbBackdropUrl(movie.backdrop_path)}
        alt={`${movie.title} 배경 이미지`}
      />
      <div className="detail__body">
        <PosterImage
          className="detail__poster"
          url={getTmdbPosterUrl(movie.poster_path)}
          alt={`${movie.title} 포스터`}
        />
        <div className="detail__info">
          <h1>{movie.title}</h1>
          <p className="detail__original">{movie.original_title}</p>
          <p>{movie.release_date || "개봉일 미정"}</p>
          <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
          <p>{formatRuntime(movie.runtime)}</p>
          {movie.tagline && <p className="detail__tagline">{movie.tagline}</p>}
          <p>{movie.overview || "줄거리 정보가 없어요."}</p>
        </div>
      </div>
    </main>
  );
}
