import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "../components/layout/header";
import { Providers } from "./providers";
import "../App.css";
import "../index.css";

// oxlint-disable-next-line react/only-export-components -- Next.js reads metadata from the server layout.
export const metadata: Metadata = {
  title: "UMCine",
  description: "영화를 검색하고 즐겨찾기와 평점을 관리하세요.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div id="root">
          <Providers>
            <Header />
            <div className="app-content">{children}</div>
            <footer className="site-footer">
              <div><img src="/images/logos/tmdb-logo.svg" alt="TMDB" /><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></div>
            </footer>
          </Providers>
        </div>
      </body>
    </html>
  );
}
