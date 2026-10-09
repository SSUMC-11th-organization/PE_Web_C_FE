import { Link, useRouterState } from '@tanstack/react-router';
import { useBookmarkStore } from '../../stores/bookmark-store';
import { cn } from '../../utils/cn';
import { Icon } from './icon';

export function Header() {
  const bookmarkCount = useBookmarkStore((state) => state.bookmarkedMovieIds.length);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
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
          <Link to="/" aria-label="UMCine 영화 목록" className="flex shrink-0 items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
              <Icon name="movie" />
            </span>
            <span className="text-xl font-black tracking-[-0.7px]">UMCine</span>
          </Link>
          <nav aria-label="주 메뉴" className="flex items-center gap-4 sm:gap-[30px]">
            <Link
              to="/"
              className={menuClass(movieActive)}
              aria-current={movieActive ? 'page' : undefined}
            >
              영화
            </Link>
            <Link
              to="/search"
              search={{ query: '' }}
              className={menuClass(searchActive)}
              aria-current={searchActive ? 'page' : undefined}
            >
              검색
            </Link>
            <span
              className="hidden text-sm font-bold text-muted sm:block"
              title="내 정보는 다음 주차 구현 예정입니다."
            >
              내 정보
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-muted" aria-live="polite">
            북마크 {bookmarkCount}편
          </span>
          <Link
            to="/search"
            search={{ query: '' }}
            aria-label="영화 검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-white hover:bg-page"
          >
            <Icon name="search" />
          </Link>
          <span
            className="hidden h-[42px] items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-white sm:flex"
            title="로그인은 다음 주차 구현 예정입니다."
          >
            로그인
          </span>
        </div>
      </div>
    </header>
  );
}
