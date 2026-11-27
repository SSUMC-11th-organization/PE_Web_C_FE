import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MovieDetailPage } from '@/screens/movies/movie-detail-page';
import { MovieHydration } from '@/server/movie-hydration';
import { readMovieDetail } from '@/server/tmdb';
import { parseMovieId } from '@/utils/movies/route-search';

type Props = { params: Promise<{ movieId: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseMovieId((await params).movieId);
  if (id === null) return { title: '영화 없음' };
  try {
    const movie = await readMovieDetail(id);
    return {
      title: movie.title,
      description: movie.overview || '영화 상세 정보',
      openGraph: {
        title: movie.title,
        description: movie.overview || '영화 상세 정보',
        ...(movie.poster_path
          ? { images: [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] }
          : {}),
      },
    };
  } catch {
    return { title: '영화 상세' };
  }
}
export default async function Page({ params }: Props) {
  const movieId = (await params).movieId;
  if (parseMovieId(movieId) === null) notFound();
  return (
    <MovieHydration kind="detail" movieId={Number(movieId)}>
      <MovieDetailPage key={movieId} movieId={movieId} />
    </MovieHydration>
  );
}
