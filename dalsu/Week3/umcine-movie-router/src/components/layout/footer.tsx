import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container className="flex min-h-14 items-center justify-end gap-2 py-4 text-sm text-gray-500">
        <span
          className="rounded-sm bg-linear-to-r from-[#90cea1] to-[#01b4e4] px-1 text-[9px] font-black leading-4 text-white"
          aria-hidden="true"
        >
          TMDB
        </span>
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-ink"
          >
            TMDB
          </a>
          .
        </p>
      </Container>
    </footer>
  );
}
