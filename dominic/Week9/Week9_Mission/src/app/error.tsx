'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="px-5 py-24 text-center">
      <h1 className="text-2xl font-bold">화면을 불러오지 못했어요.</h1>
      <p role="alert" className="my-4 text-muted">
        잠시 후 다시 시도해 주세요.
      </p>
      <button type="button" onClick={reset} className="rounded-lg bg-primary px-5 py-3 text-white">
        다시 시도
      </button>
    </section>
  );
}
