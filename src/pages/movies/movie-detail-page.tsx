import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message.ts";

import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", parsedMovieId],
    queryFn: () => getMovieDetail(parsedMovieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  if (!isValidMovieId) {
    return (
      <main className="detail-state">
        <h1>올바르지 않은 영화 번호예요.</h1>
        <Link to="/">영화 목록으로 돌아가기 →</Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="detail-state" role="status">
        <span className="detail-state__loader" />
        <p>영화 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="detail-state" role="alert">
        <p>{getMovieDetailErrorMessage(movieDetailQuery.error)}</p>
        <Link to="/">영화 목록으로 돌아가기 →</Link>
      </main>
    );
  }

  const movie = movieDetailQuery.data;

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const runtimeText = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : "정보 없음";

  return (
    <main className="movie-detail">
      <div className="movie-detail__hero" aria-hidden="true">
        {backdropUrl && <img src={backdropUrl} alt="" />}
        <div className="movie-detail__hero-shade" />
      </div>

      <div className="movie-detail__container">
        <Link to="/" className="movie-detail__back">
          <img src="/icons/chevron-left.svg" alt="" />
          영화 목록으로
        </Link>

        <div className="movie-detail__layout">
          <aside className="movie-detail__poster-column">
            <div className="movie-detail__poster">
              {posterUrl ? (
                <img src={posterUrl} alt={`${movie.title} 포스터`} />
              ) : (
                <div className="movie-detail__no-poster">
                  <img src="/icons/movie.svg" alt="" />
                  <span>포스터 준비 중</span>
                </div>
              )}
            </div>

            <p className="movie-detail__poster-caption">
              UMCine · MOVIE COLLECTION
            </p>
          </aside>

          <article className="movie-detail__content">
            <header className="movie-detail__heading">
              <span className="movie-detail__eyebrow">MOVIE DETAILS</span>
              <h1>{movie.title}</h1>
              <p className="movie-detail__original-title">
                {movie.original_title}
              </p>

              <div className="movie-detail__genres">
                {movie.genres.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </div>
            </header>

            <dl className="movie-detail__facts">
              <div>
                <dt>관객 평점</dt>
                <dd className="movie-detail__score">
                  <img src="/icons/star.svg" alt="" />
                  {movie.vote_count > 0
                    ? movie.vote_average.toFixed(1)
                    : "미집계"}
                  {movie.vote_count > 0 && <small>/ 10</small>}
                </dd>
              </div>

              <div>
                <dt>개봉일</dt>
                <dd>
                  {movie.release_date
                    ? movie.release_date.replaceAll("-", ".")
                    : "미정"}
                </dd>
              </div>

              <div>
                <dt>상영 시간</dt>
                <dd>{runtimeText}</dd>
              </div>
            </dl>

            <section
              className="movie-detail__story"
              aria-labelledby="movie-story-title"
            >
              <h2 id="movie-story-title">줄거리</h2>

              {movie.tagline && (
                <p className="movie-detail__tagline">
                  “{movie.tagline}”
                </p>
              )}

              <p className="movie-detail__overview">
                {movie.overview || "아직 등록된 줄거리가 없어요."}
              </p>
            </section>

            <footer className="movie-detail__credit">
              <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
              <span>영화 정보 제공 · The Movie Database</span>
            </footer>
          </article>
        </div>
      </div>
    </main>
  );
}
