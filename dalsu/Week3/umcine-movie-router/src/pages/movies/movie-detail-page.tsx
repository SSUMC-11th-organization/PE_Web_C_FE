import { Link, useParams } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { ArrowRightIcon, BookmarkIcon, StarIcon } from "../../components/icons";
import { Container } from "../../components/layout/container";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

const RATINGS = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <Container className="flex flex-col items-center py-40 text-center">
        <p className="text-xl font-bold text-ink">영화를 찾을 수 없어요.</p>
        <Link to="/" className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-700">
          영화 목록으로 돌아가기
        </Link>
      </Container>
    );
  }

  return (
    // key로 다른 영화로 이동하면 즐겨찾기·평점 state를 새로 시작해요
    <MovieDetail key={movie.id} movie={movie} />
  );
}

function MovieDetail({ movie }: { movie: Movie }) {
  const [isBookmarked, setIsBookmarked] = useState(movie.isBookmarked);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === 0) return;
    setIsSaved(true);
  }

  return (
    <>
      <section className="relative h-[360px] overflow-hidden bg-ink">
        {/* 장식용 배경 이미지라서 alt를 비워 스크린 리더가 읽지 않게 해요 */}
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-transparent" />
        <Container className="relative py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-white/85 hover:text-white"
          >
            <ArrowRightIcon className="size-4 rotate-180" />
            영화 목록
          </Link>
        </Container>
      </section>

      <Container className="flex flex-col gap-10 pb-24 pt-10 lg:flex-row lg:gap-0">
        <div className="flex flex-1 flex-col gap-8 sm:flex-row lg:pr-12">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-[200px] shrink-0 rounded-xl object-cover shadow-2xl"
          />
          <div className="pt-1">
            {/* Figma 화면에는 제목 글자가 없어서, 제목은 스크린 리더에만 읽혀요 */}
            <h1 className="sr-only">{movie.title}</h1>
            <h2 className="text-2xl font-bold tracking-tight text-ink">{movie.tagline}</h2>
            <p className="mt-4 leading-7 text-gray-600">{movie.overview}</p>
            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => setIsBookmarked((prev) => !prev)}
              className={cn(
                "mt-6 inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-bold",
                isBookmarked
                  ? "border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
                  : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
              )}
            >
              <BookmarkIcon className="size-5" filled={isBookmarked} />
              {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full shrink-0 border-gray-300 lg:w-[360px] lg:border-l lg:pl-10"
        >
          <h2 className="text-2xl font-bold tracking-tight text-ink">내 평점</h2>
          <p className="mt-2 text-sm text-gray-400">별점은 필수, 후기는 선택이에요.</p>
          <div className="mt-3 flex gap-1.5" role="radiogroup" aria-label="별점">
            {RATINGS.map((score) => (
              <button
                key={score}
                type="button"
                role="radio"
                aria-checked={rating === score}
                aria-label={`${score}점`}
                onClick={() => {
                  setRating(score);
                  setIsSaved(false);
                }}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md bg-white shadow-sm",
                  score <= rating ? "text-amber-400" : "text-gray-500 hover:text-amber-300",
                )}
              >
                <StarIcon className="size-5" />
              </button>
            ))}
          </div>
          <textarea
            value={review}
            onChange={(event) => {
              setReview(event.target.value);
              setIsSaved(false);
            }}
            aria-label="후기"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-[100px] w-full resize-none rounded-lg bg-white p-3 text-sm text-ink outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={rating === 0}
            className={cn(
              "mt-2 h-10 w-full rounded-lg text-sm font-bold text-white",
              rating === 0 ? "cursor-not-allowed bg-ink/40" : "bg-ink hover:bg-black",
            )}
          >
            평점 저장
          </button>
          <p className="mt-2 min-h-5 text-sm text-gray-500" aria-live="polite">
            {isSaved ? `${rating}점으로 평점을 저장했어요.` : ""}
          </p>
        </form>
      </Container>
    </>
  );
}
