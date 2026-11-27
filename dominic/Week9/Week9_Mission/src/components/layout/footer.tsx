import Image from 'next/image';
import Link from 'next/link';
export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-end gap-2 px-5 py-4 lg:px-20">
        <Image
          width={24}
          height={18}
          className="h-auto w-6 shrink-0"
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
        />
        <Link href="/about" className="mr-auto shrink-0 text-xs text-muted underline">
          서비스 소개
        </Link>
        <p className="text-xs text-muted">
          This product uses the TMDB API but is not endorsed or certified by{' '}
          <a
            href="https://www.themoviedb.org/?language=ko"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
