import { type FormEvent, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../layout/icon';

function readRating(movieId: number): { score: number; review: string } {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(`umcine-rating-${movieId}`) ?? 'null');
    if (
      saved &&
      typeof saved === 'object' &&
      'score' in saved &&
      'review' in saved &&
      typeof saved.score === 'number' &&
      Number.isInteger(saved.score) &&
      saved.score >= 1 &&
      saved.score <= 5 &&
      typeof saved.review === 'string'
    ) {
      return { score: saved.score, review: saved.review };
    }
  } catch {
    // 저장값이 잘못되었거나 브라우저 저장소를 사용할 수 없으면 기본값을 사용합니다.
  }
  return { score: 0, review: '' };
}

export function RatingPanel({ movieId }: { movieId: number }) {
  const [rating, setRating] = useState(() => readRating(movieId));
  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState(false);
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rating.score) {
      setInvalid(true);
      setMessage('별점을 먼저 선택해 주세요.');
      return;
    }
    try {
      localStorage.setItem(`umcine-rating-${movieId}`, JSON.stringify(rating));
      setInvalid(false);
      setMessage('평점을 이 브라우저에 저장했어요.');
    } catch {
      setInvalid(true);
      setMessage('브라우저 저장소를 사용할 수 없어 저장하지 못했어요.');
    }
  };

  return (
    <aside className="min-w-0 border-t border-line pt-6 lg:w-[360px] lg:shrink-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pb-[41px] lg:pl-[30px]">
      <h2 className="text-[21px] font-bold tracking-[-0.63px]">내 평점</h2>
      <p className="mt-2 text-xs text-subtle">별점은 필수, 후기는 선택이에요.</p>
      <form onSubmit={save} className="mt-2 flex flex-col gap-2">
        <fieldset>
          <legend className="sr-only">영화 별점</legend>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((score) => (
              <label
                key={score}
                className={cn(
                  'relative flex size-[38px] cursor-pointer items-center justify-center rounded-lg border border-line bg-white text-muted',
                  rating.score >= score && 'border-amber-400 bg-amber-50',
                )}
              >
                <input
                  type="radio"
                  name={`rating-${movieId}`}
                  aria-label={`${score}점`}
                  value={score}
                  checked={rating.score === score}
                  onChange={() => {
                    setRating((previous) => ({ ...previous, score }));
                    setMessage('');
                    setInvalid(false);
                  }}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    'rounded peer-focus-visible:outline-2 peer-focus-visible:outline-primary',
                    rating.score < score && 'opacity-60',
                  )}
                >
                  <Icon name="star" />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label>
          <span className="sr-only">영화 후기 (선택)</span>
          <textarea
            value={rating.review}
            onChange={(event) => {
              setRating((previous) => ({ ...previous, review: event.target.value }));
              setMessage('');
            }}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[102px] w-full resize-y rounded-lg border border-line bg-white px-3 py-4 text-[13px] leading-[19.5px] placeholder:text-subtle"
          />
        </label>
        <button
          type="submit"
          className="h-[42px] rounded-lg bg-ink text-sm font-extrabold text-white hover:bg-ink/80"
        >
          평점 저장
        </button>
        <p role="status" className={cn('text-xs text-primary', invalid && 'text-red-600')}>
          {message}
        </p>
      </form>
    </aside>
  );
}
