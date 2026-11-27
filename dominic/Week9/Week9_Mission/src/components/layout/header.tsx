'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { accountQueries } from '../../queries/account';
import { useAuthStore } from '../../stores/auth-store';
import { cn } from '../../utils/cn';
import { Icon } from './icon';

export function Header() {
  const { accessToken, session, setAccessToken } = useAuthStore();
  const meQuery = useQuery(accountQueries.me(session, !!accessToken));
  const favorites = useQuery(accountQueries.favorites(session, !!accessToken));
  const pathname = usePathname();
  const movieActive = pathname === '/' || pathname.startsWith('/movies/');
  const searchActive = pathname === '/search';
  const menuClass = (active: boolean) =>
    cn(
      'text-sm font-bold text-muted hover:text-ink',
      active && 'text-ink underline underline-offset-4',
    );

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-y-4 px-5 py-6 lg:px-20">
        <div className="flex items-center gap-6 sm:gap-[42px]">
          <Link
            href="/?page=1"
            aria-label="UMCine 영화 목록"
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
              <Icon name="movie" />
            </span>
            <span className="text-xl font-black tracking-[-0.7px]">UMCine</span>
          </Link>
          <nav aria-label="주 메뉴" className="flex items-center gap-4 sm:gap-[30px]">
            <Link
              href="/?page=1"
              className={menuClass(movieActive)}
              aria-current={movieActive ? 'page' : undefined}
            >
              영화
            </Link>
            <Link
              href="/search"
              className={menuClass(searchActive)}
              aria-current={searchActive ? 'page' : undefined}
            >
              검색
            </Link>
            <Link
              href="/my"
              className={menuClass(pathname.startsWith('/my'))}
              aria-current={pathname.startsWith('/my') ? 'page' : undefined}
            >
              내 정보
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-muted" aria-live="polite">
            {accessToken
              ? favorites.data
                ? `즐겨찾기 ${favorites.data.length}편`
                : '즐겨찾기'
              : '영화와 함께하는 하루'}
          </span>
          <Link
            href="/search"
            aria-label="영화 검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-white hover:bg-page"
          >
            <Icon name="search" />
          </Link>
          {!accessToken ? (
            <Link
              href="/login"
              className="flex h-[42px] items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-white"
            >
              로그인
            </Link>
          ) : (
            <>
              {meQuery.isLoading ? (
                <span role="status" className="text-sm">
                  회원 확인 중
                </span>
              ) : (
                <Link
                  href="/my"
                  className="rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white"
                >
                  {meQuery.data ? `${meQuery.data.nickname}님` : '마이페이지'}
                </Link>
              )}
              <button
                type="button"
                className="text-xs text-muted underline"
                onClick={() => setAccessToken(null)}
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
