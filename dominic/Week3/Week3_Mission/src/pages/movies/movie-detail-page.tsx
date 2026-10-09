import { Link } from '@tanstack/react-router';
import { Icon } from '../../components/layout/icon';
import { useMovies } from '../../components/movies/movie-context';
import { RatingPanel } from '../../components/movies/rating-panel';
import { cn } from '../../utils/cn';
import { findMovie } from '../../utils/movie-search';

export function MovieDetailPage({ movieId }: { movieId: string }) {
  const { movies, toggleBookmark } = useMovies();
  const movie = findMovie(movies, movieId);

  if (!movie)
    return (
      <section className="px-5 py-24 text-center">
        <title>UMCine | 영화를 찾을 수 없어요</title>
        <h1 className="text-2xl font-bold">영화를 찾을 수 없어요.</h1>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white"
        >
          영화 목록으로 돌아가기
        </Link>
      </section>
    );

  return (
    <div>
      <title>{`UMCine | ${movie.title}`}</title>
      <section className="relative h-[360px] overflow-hidden text-white">
        <img
          src={movie.backdropPath}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-between px-5 py-6 lg:px-20">
          <Link
            to="/"
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
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(' · ')}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-6 sm:grid-cols-[200px_minmax(0,1fr)] lg:flex lg:items-start lg:px-20">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[286px] w-[200px] rounded-[10px] object-cover shadow-[0_12px_30px_rgba(12,15,20,0.12)]"
        />
        <section className="min-w-0 flex-1">
          <h2 className="text-[21px] font-bold tracking-[-0.63px]">{movie.tagline}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{movie.overview}</p>
          <button
            type="button"
            aria-pressed={movie.isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              'mt-3 inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white',
              movie.isBookmarked && 'bg-ink',
            )}
          >
            <Icon name={movie.isBookmarked ? 'bookmark' : 'bookmark-outline'} small inverted />
            {movie.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
          </button>
        </section>
        <div className="sm:col-span-2 lg:contents">
          <RatingPanel key={movie.id} movieId={movie.id} />
        </div>
      </div>
    </div>
  );
}
