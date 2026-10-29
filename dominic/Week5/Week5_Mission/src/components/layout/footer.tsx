export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-end gap-2 px-5 py-4 lg:px-20">
        <img className="h-auto w-6 shrink-0" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
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
