import assert from 'node:assert/strict';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.APP_URL || 'http://127.0.0.1:5190';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const checks = [];
async function page(route, expected, status = 200) {
  const response = await fetch(`${base}${route}`);
  const html = await response.text();
  assert.equal(response.status, status, `${route}: status`);
  for (const text of expected) assert(html.includes(text), `${route}: ${text}`);
  if (process.env.TMDB_ACCESS_TOKEN)
    assert(!html.includes(process.env.TMDB_ACCESS_TOKEN), 'TMDB token must not be serialized');
  checks.push({ route, status: response.status, passed: true });
  return html;
}
const html = await page('/?page=2', ['영화 목록', 'data-testid="movie-card"', '<html lang="ko"']);
assert(html.includes('srcSet=') || html.includes('srcset='), 'Next Image responsive sources');
await page('/search?query=%EC%9D%B8%EC%85%89%EC%85%98&page=1', [
  '인셉션 검색 결과 | UMCine',
  'data-testid="search-result"',
]);
await page('/movies/1726', ['아이언맨 | UMCine', 'Iron Man', 'property="og:title"']);
await page('/about', ['영화와 함께하는 하루, UMCine']);
await page('/missing-page', ['페이지를 찾을 수 없어요.'], 404);
const invalid = await fetch(`${base}/api/tmdb/account`);
assert.equal(invalid.status, 404);
checks.push({ route: '/api/tmdb/account', status: invalid.status, passed: true });

let bundleCount = 0;
async function scan(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, item.name);
    if (item.isDirectory()) await scan(filename);
    else if (filename.endsWith('.js')) {
      bundleCount++;
      const content = await readFile(filename, 'utf8');
      if (process.env.TMDB_ACCESS_TOKEN)
        assert(
          !content.includes(process.env.TMDB_ACCESS_TOKEN),
          'TMDB token must not appear in browser JS',
        );
      assert(!content.includes('VITE_TMDB_ACCESS_TOKEN'), 'Vite env must be removed');
    }
  }
}
await scan('.next/static');
const result = {
  passed: true,
  checks,
  ssrVerifiedWithoutBrowserJavaScript: true,
  browserBundlesScanned: bundleCount,
  tokenLeakCheck: process.env.TMDB_ACCESS_TOKEN ? 'passed' : 'skipped: token not set',
};
await writeFile('docs/next-verification.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result));
