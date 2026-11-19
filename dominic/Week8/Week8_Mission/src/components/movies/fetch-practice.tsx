import { useEffect, useRef, useState } from 'react';
import { getMoviesWithFetch } from '../../api/movies/get-movies-with-fetch';
import { getRequestErrorMessage } from '../../utils/movies/request-error';

export function FetchPractice() {
  const [message, setMessage] = useState(
    'Network 패널을 열고 버튼을 누르면 순수 fetch 요청을 확인할 수 있어요.',
  );
  const [loading, setLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function run() {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setMessage('순수 fetch로 인기 영화를 요청하는 중이에요.');
    try {
      const response = await getMoviesWithFetch(1, request.signal);
      if (!request.signal.aborted)
        setMessage(
          `fetch 성공 · ${response.results.length}편 · ${response.page}페이지. Network의 Headers와 Response를 확인해 보세요.`,
        );
    } catch (error) {
      if (!request.signal.aborted) setMessage(getRequestErrorMessage(error));
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }
  return (
    <details className="mb-6 rounded-xl border border-line bg-white p-4 text-sm">
      <summary className="cursor-pointer font-bold">학습용 · 순수 fetch 요청 확인</summary>
      <p role="status" className="mt-3 leading-6 text-muted">
        {message}
      </p>
      <button
        type="button"
        disabled={loading}
        onClick={() => void run()}
        className="mt-3 rounded-lg border border-line px-4 py-2 font-bold disabled:opacity-40"
      >
        {loading ? '요청 중…' : 'fetch로 인기 영화 요청'}
      </button>
      <p className="mt-2 text-xs text-subtle">
        아래 영화 화면은 ky로 요청해요. 이 버튼은 비교 실습용이며 자동 실행하지 않아요.
      </p>
    </details>
  );
}
