import { getRequestErrorMessage } from '../../utils/movies/request-error';

export function RequestLoading() {
  return (
    <div
      role="status"
      className="rounded-xl border border-line bg-white px-5 py-20 text-center text-muted"
    >
      영화 정보를 불러오는 중이에요.
    </div>
  );
}

export function RequestError({
  error,
  onRetry,
  detail = false,
}: {
  error: unknown;
  onRetry: () => void;
  detail?: boolean;
}) {
  return (
    <div role="alert" className="rounded-xl border border-line bg-white px-5 py-16 text-center">
      <p className="mx-auto max-w-xl text-sm leading-6 text-muted">
        {getRequestErrorMessage(error, detail)}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
