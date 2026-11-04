import { Outlet } from '@tanstack/react-router';
import { Footer } from './footer';
import { Header } from './header';
import { StorageNotice } from './storage-notice';

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:p-3">
        본문으로 건너뛰기
      </a>
      <Header />
      <StorageNotice />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
