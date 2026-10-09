import { Outlet } from '@tanstack/react-router';
import { MovieProvider } from '../movies/movie-provider';
import { Footer } from './footer';
import { Header } from './header';

export function RootLayout() {
  return (
    <MovieProvider>
      <div className="flex min-h-screen flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:p-3">
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </MovieProvider>
  );
}
