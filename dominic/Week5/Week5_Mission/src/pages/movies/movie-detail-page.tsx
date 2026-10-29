import { Link } from '@tanstack/react-router';
import { useCallback } from 'react';
import { getMovieDetail } from '../../api/movies/get-movie-detail';
import { Icon } from '../../components/layout/icon';
import { BookmarkButton } from '../../components/movies/bookmark-button';
import { MovieImage } from '../../components/movies/movie-image';
import { RatingPanel } from '../../components/movies/rating-panel';
import { RequestError, RequestLoading } from '../../components/movies/request-feedback';
import { useMovieRequest } from '../../hooks/use-movie-request';
import { toMovieDetail } from '../../utils/movies/adapters';
import { parseMovieId } from '../../utils/movies/route-search';

export function MovieDetailPage({ movieId }: { movieId: string }) {
  const id = parseMovieId(movieId);
  if (id === null)
    return (
      <section className="px-5 py-24 text-center">
        <title>UMCine | 올바르지 않은 영화 번호</title>
        <h1 className="text-2xl font-bold">올바르지 않은 영화 번호예요.</h1>
        <Link to="/" search={{ page: 1 }} className="mt-6 inline-block text-primary underline">
          영화 목록으로 돌아가기
        </Link>
      </section>
    );
  return <MovieDetailContent key={id} movieId={id} />;
}

function MovieDetailContent({ movieId }: { movieId: number }) {
  const load = useCallback((signal: AbortSignal) => getMovieDetail(movieId, signal), [movieId]);
  const { state, retry } = useMovieRequest(load);
  if (state.status !== 'success')
    return (
      <section className="mx-auto max-w-[1600px] px-5 py-12 lg:px-20">
        <title>UMCine | 영화 상세</title>
        <h1 className="mb-5 text-2xl font-bold">영화 상세</h1>
        {state.status === 'loading' ? (
          <RequestLoading />
        ) : (
          <RequestError error={state.error} onRetry={retry} detail />
        )}
        <Link to="/" search={{ page: 1 }} className="mt-6 inline-block text-primary underline">
          영화 목록으로 돌아가기
        </Link>
      </section>
    );
  const movie = toMovieDetail(state.data);
  return (
    <div>
      <title>{`UMCine | ${movie.title}`}</title>
      <section className="relative h-[360px] overflow-hidden text-white">
        <MovieImage
          src={movie.backdropPath}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-between px-5 py-6 lg:px-20">
          <Link
            to="/"
            search={{ page: 1 }}
            className="inline-flex w-fit items-center gap-1 text-[13px] font-bold hover:underline"
          >
            <Icon name="chevron-left" inverted />
            영화 목록
          </Link>
          <div className="max-w-[800px]">
            <h1 className="text-[32px] leading-[1.08] font-bold tracking-[-1.5px] sm:text-[46px] sm:tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="mt-2 text-sm">{movie.originalTitle}</p>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[13px] font-bold">
              <span>{movie.releaseDate || '개봉일 정보 없음'}</span>
              <span>{movie.genres.join(' · ') || '장르 정보 없음'}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-6 sm:grid-cols-[200px_minmax(0,1fr)] lg:flex lg:items-start lg:px-20">
        <MovieImage
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[286px] w-[200px] rounded-[10px] object-cover shadow-[0_12px_30px_rgba(12,15,20,0.12)]"
        />
        <section className="min-w-0 flex-1">
          <h2 className="text-[21px] font-bold tracking-[-0.63px]">{movie.tagline}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{movie.overview}</p>
          <div className="mt-3">
            <BookmarkButton movie={movie} />
          </div>
        </section>
        <div className="sm:col-span-2 lg:contents">
          <RatingPanel key={movie.id} movieId={movie.id} />
        </div>
      </div>
    </div>
  );
}
