import { useState } from 'react';

type Result = { text: string; error?: boolean };
const base = import.meta.env.VITE_MEMBER_API_BASE_URL || 'http://127.0.0.1:3002';

export function MemberApiPanel() {
  const [nickname, setNickname] = useState('수현');
  const [email, setEmail] = useState('noco@umc.com');
  const [memberId, setMemberId] = useState('1');
  const [page, setPage] = useState('0');
  const [size, setSize] = useState('1');
  const [results, setResults] = useState<Record<string, Result>>({});
  const [loading, setLoading] = useState('');
  async function request(key: string, path: string) {
    setLoading(key);
    try {
      const response = await fetch(`${base}${path}`);
      const data: unknown = await response.json();
      setResults((current) => ({
        ...current,
        [key]: {
          text: `HTTP ${response.status}\n${JSON.stringify(data, null, 2)}`,
          error: !response.ok,
        },
      }));
    } catch {
      setResults((current) => ({
        ...current,
        [key]: {
          text: '서버에 연결하지 못했습니다. 백엔드 실행 상태와 CORS 설정을 확인하세요.',
          error: true,
        },
      }));
    } finally {
      setLoading('');
    }
  }
  const input = 'min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm';
  const button = 'rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50';
  const result = (key: string) =>
    results[key] && (
      <pre
        aria-live="polite"
        className={`mt-3 overflow-auto rounded-lg p-3 text-xs ${results[key].error ? 'bg-red-50 text-red-700' : 'bg-page text-ink'}`}
      >
        {results[key].text}
      </pre>
    );
  return (
    <section
      aria-labelledby="member-api-title"
      className="mb-8 rounded-2xl border border-line bg-white p-5 sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-bold tracking-wider text-primary">UMC 5주차 · 회원 API</p>
        <h2 id="member-api-title" className="mt-1 text-xl font-bold">
          회원 정보와 평점 확인
        </h2>
        <p className="mt-1 text-sm text-muted">
          서버에 직접 요청해 사용 가능 여부와 회원별 평점을 확인합니다.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void request('nickname', `/members/nickname/${encodeURIComponent(nickname)}`);
          }}
        >
          <label htmlFor="member-nickname" className="mb-2 block text-sm font-bold">
            닉네임 중복 확인
          </label>
          <div className="flex gap-2">
            <input
              id="member-nickname"
              className={input}
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              required
            />
            <button type="submit" className={button} disabled={!!loading}>
              확인
            </button>
          </div>
          {result('nickname')}
        </form>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void request('email', `/members/email/${encodeURIComponent(email)}`);
          }}
        >
          <label htmlFor="member-email" className="mb-2 block text-sm font-bold">
            이메일 중복 확인
          </label>
          <div className="flex gap-2">
            <input
              id="member-email"
              className={input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" className={button} disabled={!!loading}>
              확인
            </button>
          </div>
          {result('email')}
        </form>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void request(
              'ratings',
              `/members/${encodeURIComponent(memberId)}/ratings?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`,
            );
          }}
        >
          <label htmlFor="member-id" className="mb-2 block text-sm font-bold">
            회원별 평점 조회
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              id="member-id"
              aria-label="회원 ID"
              className={input}
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              required
            />
            <input
              aria-label="페이지 번호"
              className="w-16 rounded-lg border border-line px-2 py-2 text-sm"
              value={page}
              onChange={(event) => setPage(event.target.value)}
            />
            <input
              aria-label="페이지 크기"
              className="w-16 rounded-lg border border-line px-2 py-2 text-sm"
              value={size}
              onChange={(event) => setSize(event.target.value)}
            />
            <button type="submit" className={button} disabled={!!loading}>
              조회
            </button>
          </div>
          <p className="mt-1 text-xs text-muted">회원 ID · 페이지(0부터) · 페이지 크기</p>
          {result('ratings')}
        </form>
      </div>
    </section>
  );
}
