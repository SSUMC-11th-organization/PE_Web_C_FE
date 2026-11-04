import { useEffect, useState } from 'react';

export type RequestState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; data: T };

// 호출부는 URL별 key와 useCallback으로 요청의 정체성을 명확히 해요.
export function useMovieRequest<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<RequestState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt는 실패한 동일 요청의 명시적 재실행 트리거예요.
  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;
    async function run() {
      try {
        const data = await load(controller.signal);
        if (!ignore) setState({ status: 'success', data });
      } catch (error) {
        if (!ignore) setState({ status: 'error', error });
      }
    }
    void run();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [load, attempt]);
  const retry = () => {
    setState({ status: 'loading' });
    setAttempt((previous) => previous + 1);
  };
  return { state, retry };
}
