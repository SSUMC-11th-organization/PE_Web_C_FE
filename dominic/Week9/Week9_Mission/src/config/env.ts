export interface TmdbConfig {
  baseUrl: string;
  accessToken: string;
}
export class TmdbConfigError extends Error {
  constructor() {
    super('서버의 TMDB_ACCESS_TOKEN 설정을 확인해 주세요.');
    this.name = 'TmdbConfigError';
  }
}
export function getTmdbConfig(): TmdbConfig {
  // TMDB credential is only read in server/tmdb.ts.
  return { baseUrl: '/api/tmdb', accessToken: '' };
}
