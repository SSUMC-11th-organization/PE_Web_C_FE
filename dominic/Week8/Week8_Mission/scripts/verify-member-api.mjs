import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';

// 독립된 실습 회원을 만들고 그 회원이 만든 평점/즐겨찾기만 삭제해 검증합니다.
const base = process.env.MEMBER_API_URL || 'http://127.0.0.1:3008';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname), '로컬 실습 서버만 검증합니다.');
const suffix = randomBytes(5).toString('hex');
const email = `fe-week8-${suffix}@example.com`;
const nickname = `실습${suffix.slice(0, 8)}`;
const password = `Verify8!${randomBytes(8).toString('hex')}`;
const movieId = 27205;
let token;
const steps = [];
async function request(method, path, body, expected = 200, authenticated = true) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  steps.push({ method, path, status: response.status });
  assert.equal(response.status, expected, `${method} ${path} HTTP 상태`);
  const data = await response.json();
  assert.equal(data.isSuccess, expected < 400, `${method} ${path} 응답 상태`);
  return data.result;
}
await request('GET', '/members/me', undefined, 401, false);
await request('POST', '/members', { email, nickname, password }, 201, false);
await request('POST', '/auth/login', { email, password: 'Wrong8Password!' }, 401, false);
const login = await request('POST', '/auth/login', { email, password }, 200, false);
token = login.accessToken;
assert.equal(typeof token, 'string');
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
const memberId = Number(payload.sub);
assert(Number.isSafeInteger(memberId) && memberId > 0);
const me = await request('GET', '/members/me');
assert.equal(me.nickname, nickname);
const updated = await request('PATCH', '/members/me', { nickname: `수정${suffix.slice(0, 8)}` });
assert.equal(updated.nickname, `수정${suffix.slice(0, 8)}`);
assert.equal((await request('GET', '/members/me')).nickname, updated.nickname);
assert.deepEqual(await request('GET', '/favorites'), []);
assert.equal((await request('GET', `/favorites/${movieId}`)).isFavorite, false);
await request('POST', '/favorites', { movieId }, 201);
assert.equal((await request('GET', `/favorites/${movieId}`)).isFavorite, true);
assert((await request('GET', '/favorites')).some((item) => item.movieId === movieId));
await request('DELETE', `/favorites/${movieId}`);
assert.equal((await request('GET', `/favorites/${movieId}`)).isFavorite, false);
assert.deepEqual(await request('GET', '/favorites'), []);
const created = await request(
  'POST',
  '/ratings',
  { movieId, score: 4, comment: '프론트 API 연동 검증' },
  201,
);
const ratingId = created.ratingId;
assert(Number.isSafeInteger(ratingId) && ratingId > 0);
const path = `/members/${memberId}/ratings`;
assert.equal((await request('GET', path)).find((item) => item.ratingId === ratingId)?.score, 4);
await request('PATCH', `/ratings/${ratingId}`, { score: 5, comment: '수정 검증' });
assert.equal((await request('GET', path)).find((item) => item.ratingId === ratingId)?.score, 5);
await request('DELETE', `/ratings/${ratingId}`);
assert(!(await request('GET', path)).some((item) => item.ratingId === ratingId));

await mkdir('docs', { recursive: true });
// 비밀번호·토큰·Authorization·로그인 응답은 파일과 출력에 기록하지 않습니다.
await writeFile(
  'docs/api-verification.json',
  `${JSON.stringify({ base, passed: true, requests: steps.length, steps }, null, 2)}\n`,
);
console.log(
  JSON.stringify({ passed: true, requests: steps.length, result: 'docs/api-verification.json' }),
);
