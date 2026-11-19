import { useState, type SubmitEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { RatingResponse } from "../../api/members/member-api";
import { createRating, deleteRating, updateRating } from "../../api/ratings";
import { useRatingsQuery } from "../../hooks/use-member-queries";
import { useAuthStore } from "../../stores/auth-store";

export function RatingForm({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { memberId, query } = useRatingsQuery();
  const rating = query.data?.find((item) => item.movieId === movieId);

  return (
    <aside className="movie-rating">
      <h2>내 평점</h2>
      {!accessToken ? (
        <Link to="/login">로그인하고 평점 남기기</Link>
      ) : memberId === null ? (
        <p role="alert">회원 번호를 확인할 수 없어요.</p>
      ) : query.isPending ? (
        <p role="status">평점을 불러오는 중이에요.</p>
      ) : query.isError ? (
        <button type="button" onClick={() => void query.refetch()}>
          평점 다시 불러오기
        </button>
      ) : (
        <RatingEditor
          key={`${memberId}:${movieId}:${rating?.ratingId}`}
          memberId={memberId}
          movieId={movieId}
          rating={rating}
        />
      )}
    </aside>
  );
}

function RatingEditor({
  memberId,
  movieId,
  rating,
}: {
  memberId: number;
  movieId: number;
  rating?: RatingResponse;
}) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (action: "save" | "delete") => {
      if (action === "delete" && rating) {
        await deleteRating(rating.ratingId);
        return;
      }

      const input = { score, comment: comment.trim() || undefined };
      if (rating) await updateRating(rating.ratingId, input);
      else await createRating(movieId, input);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["members", memberId, "ratings"] }),
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (score && !mutation.isPending) mutation.mutate("save");
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={mutation.isPending}>
        <legend>별점 선택</legend>
        <div className="movie-rating__stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className={value <= score ? "is-selected" : ""}>
              <input type="radio" name="rating" value={value} checked={score === value}
                onChange={() => setScore(value)} aria-label={`${value}점`} />
              <span aria-hidden="true">★</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label htmlFor="rating-comment">한줄평</label>
      <textarea id="rating-comment" placeholder="이 영화는 어떠셨나요?" value={comment}
        onChange={(event) => setComment(event.target.value)} maxLength={500}
        disabled={mutation.isPending} />
      <button type="submit" disabled={!score || mutation.isPending}>
        {mutation.isPending ? "처리 중" : rating ? "평점 수정" : "평점 등록"}
      </button>
      {rating && (
        <button type="button" disabled={mutation.isPending}
          onClick={() => mutation.mutate("delete")}>
          평점 삭제
        </button>
      )}
      {mutation.isError && <p role="alert">평점 변경에 실패했어요. 다시 시도해 주세요.</p>}
      {mutation.isSuccess && <p role="status">평점을 저장했어요.</p>}
    </form>
  );
}
