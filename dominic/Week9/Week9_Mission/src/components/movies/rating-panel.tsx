'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { Rating } from '../../api/account';
import { accountMutations, accountQueries } from '../../queries/account';
import { getMemberId, useAuthStore } from '../../stores/auth-store';
import { AccountError } from '../auth/request-error';

export function RatingPanel({ movieId }: { movieId: number }) {
  const { accessToken, session } = useAuthStore();
  const [feedback, setFeedback] = useState({ session: -1, message: '' });
  const memberId = getMemberId(accessToken);
  const ratings = useQuery(accountQueries.ratings(session, memberId ?? 0, !!accessToken));
  if (!accessToken)
    return (
      <aside className="min-w-0 lg:w-[360px]">
        <h2 className="mb-3 text-xl font-bold">내 평점</h2>
        <Link href="/login" className="text-sm text-primary underline">
          로그인하고 평점 남기기
        </Link>
      </aside>
    );
  if (!memberId)
    return <p role="alert">회원 번호를 확인할 수 없어요. 로그아웃 후 다시 로그인해 주세요.</p>;
  if (ratings.isLoading) return <p role="status">평점을 불러오는 중이에요.</p>;
  if (ratings.isError)
    return (
      <aside className="space-y-3">
        <AccountError error={ratings.error} />
        <button type="button" onClick={() => void ratings.refetch()}>
          평점 다시 조회
        </button>
      </aside>
    );
  const rating = ratings.data?.find((item) => item.movieId === movieId);
  return (
    <div className="min-w-0 lg:w-[360px] lg:shrink-0">
      {feedback.session === session && feedback.message && (
        <p role="status" className="mb-3 text-sm text-primary">
          {feedback.message}
        </p>
      )}
      <RatingForm
        key={`${session}-${rating?.ratingId ?? 0}-${rating?.score ?? 0}-${rating?.comment ?? ''}`}
        movieId={movieId}
        memberId={memberId}
        session={session}
        rating={rating}
        onComplete={(message) => setFeedback({ session, message })}
      />
    </div>
  );
}
function RatingForm({
  movieId,
  memberId,
  session,
  rating,
  onComplete,
}: {
  movieId: number;
  memberId: number;
  session: number;
  rating?: Rating;
  onComplete: (message: string) => void;
}) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? '');
  const locked = useRef(false);
  const client = useQueryClient();
  const save = useMutation(
    accountMutations.saveRating(client, session, memberId, () => onComplete('평점을 저장했어요.')),
  );
  const remove = useMutation(
    accountMutations.deleteRating(client, session, memberId, () =>
      onComplete('평점을 삭제했어요.'),
    ),
  );
  const pending = save.isPending || remove.isPending;
  return (
    <aside className="min-w-0 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
      <h2 className="text-xl font-bold">내 평점</h2>
      <p className="mt-2 text-xs text-muted">별점은 필수, 후기는 선택이에요.</p>
      <form
        className="mt-3 space-y-3"
        aria-busy={pending}
        onSubmit={(event) => {
          event.preventDefault();
          if (pending || locked.current || !score || comment.length > 500) return;
          locked.current = true;
          save.mutate(
            { movieId, ratingId: rating?.ratingId, score, comment: comment || null },
            {
              onSettled: () => {
                locked.current = false;
              },
            },
          );
        }}
      >
        <fieldset disabled={pending}>
          <legend className="sr-only">영화 별점</legend>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label
                key={value}
                className={`relative cursor-pointer rounded-lg border p-2 ${score >= value ? 'border-amber-400 bg-amber-50' : 'border-line bg-white'}`}
              >
                <input
                  type="radio"
                  name={`rating-${movieId}`}
                  aria-label={`${value}점`}
                  checked={score === value}
                  onChange={() => setScore(value)}
                  className="sr-only peer"
                />
                <span aria-hidden="true" className="peer-focus-visible:outline-2">
                  ★
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="sr-only">영화 후기 (선택)</span>
          <textarea
            value={comment}
            maxLength={500}
            disabled={pending}
            onChange={(event) => setComment(event.target.value)}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-28 w-full rounded-lg border border-line bg-white p-3 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={pending || !score}
          className="h-11 w-full rounded-lg bg-ink text-sm font-bold text-white disabled:opacity-50"
        >
          {pending ? '처리 중' : rating ? '평점 수정' : '평점 등록'}
        </button>
        {rating && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!pending && !locked.current) {
                locked.current = true;
                remove.mutate(rating.ratingId, {
                  onSettled: () => {
                    locked.current = false;
                  },
                });
              }
            }}
            className="w-full py-2 text-sm text-red-600"
          >
            평점 삭제
          </button>
        )}
        {(save.error || remove.error) && <AccountError error={save.error || remove.error} />}
      </form>
    </aside>
  );
}
