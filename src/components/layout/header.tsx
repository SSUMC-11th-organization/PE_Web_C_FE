"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMeQuery } from "../../hooks/use-member-queries";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  return (
    <header className="header">
      <div className="header__inner">
        <Link href="/" className="header__logo" aria-label="UMCine 홈">
          <span className="header__brand-mark"><img src="/icons/movie.svg" alt="" /></span>
          <span>UMCine</span>
        </Link>
        <nav className="header__nav" aria-label="주 메뉴">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>영화</Link>
          <Link href="/search" aria-current={pathname === "/search" ? "page" : undefined}>검색</Link>
          <Link href="/members" aria-current={pathname.startsWith("/members") ? "page" : undefined}>내 정보</Link>
        </nav>
        <nav className="header__actions" aria-label="빠른 메뉴">
          <Link href="/search" className="header__icon-link" aria-label="영화 검색">
            <img src="/icons/search.svg" alt="" className="icon" />
          </Link>
          {!accessToken ? (
            <Link href="/login" className="header__member-link">
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link href="/members" className="header__member-link">
              마이페이지
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
