import { Link } from "@tanstack/react-router";
import { LogoIcon, SearchIcon } from "../icons";
import { Container } from "./container";

const navLinkClassName = "text-[15px] font-medium text-gray-500 hover:text-ink";
// 현재 URL과 일치하면 activeProps의 class가 더해져요
const activeNavLinkProps = { className: "font-bold text-ink underline underline-offset-8" };

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-5 sm:gap-10">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-ink">
            <LogoIcon className="size-8" />
            <span className="text-xl font-extrabold tracking-tight">UMCine</span>
          </Link>
          <nav className="flex items-center gap-3 whitespace-nowrap sm:gap-7">
            <Link
              to="/"
              className={navLinkClassName}
              activeProps={activeNavLinkProps}
              activeOptions={{ exact: true }}
            >
              영화
            </Link>
            <Link to="/search" className={navLinkClassName} activeProps={activeNavLinkProps}>
              검색
            </Link>
            {/* 내 정보 화면은 이번 미션 범위가 아니라서 아직 라우트가 없어요 */}
            <a href="/profile" className={navLinkClassName}>
              내 정보
            </a>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          {/* 좁은 화면에서는 메뉴의 "검색"과 겹쳐서 아이콘 버튼을 숨겨요 */}
          <Link
            to="/search"
            className="hidden size-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 sm:flex"
            aria-label="검색"
          >
            <SearchIcon className="size-5" />
          </Link>
          <button
            type="button"
            className="h-10 whitespace-nowrap rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 sm:px-5"
          >
            로그인
          </button>
        </div>
      </Container>
    </header>
  );
}
