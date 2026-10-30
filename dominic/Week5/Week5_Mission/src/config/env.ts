export interface TmdbConfig {
  baseUrl: string;
  accessToken: string;
}

export class TmdbConfigError extends Error {
  constructor() {
    super(
      'TMDB 토큰을 설정해 주세요. .env.example을 .env.local로 복사하고 토큰을 넣은 뒤 개발 서버를 다시 시작하세요.',
    );
    this.name = 'TmdbConfigError';
  }
}

export function getTmdbConfig(): TmdbConfig {
  const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();
  const baseUrl = (
    import.meta.env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3'
  ).replace(/\/+$/, '');
  if (!accessToken || accessToken.includes('여기에_') || accessToken.startsWith('Bearer ')) {
    throw new TmdbConfigError();
  }
  // 설정 오타로 다른 서버에 인증 토큰을 전송하지 않아요.
  if (baseUrl !== 'https://api.themoviedb.org/3') {
    throw new Error('TMDB API 주소는 https://api.themoviedb.org/3으로 설정해 주세요.');
  }
  return { baseUrl, accessToken };
}
