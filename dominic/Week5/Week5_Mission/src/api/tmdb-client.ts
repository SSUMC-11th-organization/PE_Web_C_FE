import ky from 'ky';
import { getTmdbConfig, type TmdbConfig } from '../config/env';

export function createTmdbClient(config: TmdbConfig, fetcher: typeof fetch = fetch) {
  return ky.create({
    baseUrl: `${config.baseUrl}/`,
    headers: { Authorization: `Bearer ${config.accessToken}` },
    timeout: 10_000,
    // 선택 미션의 버튼으로 마지막 실패 요청을 명시적으로 다시 실행해요.
    retry: 0,
    fetch: fetcher,
  });
}

let client: ReturnType<typeof createTmdbClient> | undefined;
export function getTmdbClient() {
  // 토큰이 없어도 앱 전체를 중단하지 않고 화면의 오류 안내로 처리해요.
  client ??= createTmdbClient(getTmdbConfig());
  return client;
}
