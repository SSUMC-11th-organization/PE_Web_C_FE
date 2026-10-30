import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getTmdbPosterUrl, getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [detail, setDetail] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setDetail(null);
    setErrorMessage(null);

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    async function loadMovie() {
      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setDetail(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadMovie();
    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  const statusMessage = !isValidId
    ? "올바르지 않은 영화 번호예요."
    : isLoading
      ? "영화 정보를 불러오는 중이에요."
      : errorMessage;

  if (statusMessage || !detail || detail.id !== parsedMovieId) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <p role={!isValidId || errorMessage ? "alert" : "status"}>
          {statusMessage ?? "영화 정보를 불러오는 중이에요."}
        </p>
        <Link to="/" className="mt-4 inline-block text-blue-600">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const movie = {
    title: detail.title,
    originalTitle: detail.original_title,
    releaseDate: detail.release_date,
    genres: detail.genres.map((genre) => genre.name),
    runtime: typeof detail.runtime === "number"
      ? `${Math.floor(detail.runtime / 60)}시간 ${detail.runtime % 60}분`
      : "상영 시간 정보가 없어요.",
    tagline: detail.tagline,
    overview: detail.overview,
    posterPath: getTmdbPosterUrl(detail.poster_path),
    backdropPath: getTmdbBackdropUrl(detail.backdrop_path),
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f5f6f8]">
      <section className="relative h-72 overflow-hidden bg-gray-900 sm:h-96">
        {movie.backdropPath ? (
          <img
            src={movie.backdropPath}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gray-500 text-white">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-6 text-white">
          <Link to="/" className="w-fit text-sm">
            ‹ 영화 목록
          </Link>

          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              {movie.title}
            </h1>
            <p className="mt-2 text-sm text-gray-200">
              {movie.originalTitle}
            </p>
            <p className="mt-1 text-sm text-gray-200">
              {movie.releaseDate} · {movie.genres.join(", ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 sm:flex-row">
        {movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-40 shrink-0 self-start rounded-lg object-cover shadow-lg sm:w-52"
          />
        ) : (
          <div className="grid aspect-[2/3] w-40 shrink-0 self-start place-items-center rounded-lg bg-gray-200 text-gray-500 sm:w-52">
            이미지 없음
          </div>
        )}

        <div className="max-w-2xl text-gray-900">
          <h2 className="text-2xl font-bold">{movie.title}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {movie.originalTitle}
          </p>
          <p className="mt-3 text-sm text-gray-600">
            {movie.releaseDate} · {movie.genres.join(", ")} · {movie.runtime}
          </p>

          <h3 className="mt-8 text-xl font-semibold">{movie.tagline}</h3>
          <p className="mt-4 leading-7 text-gray-700">{movie.overview}</p>
        </div>
      </section>
    </main>
  );
}
