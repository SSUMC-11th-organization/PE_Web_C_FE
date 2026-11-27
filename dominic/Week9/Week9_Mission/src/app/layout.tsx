import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { StorageNotice } from '@/components/layout/storage-notice';
import { Providers } from './providers';
import '../index.css';

const geist = localFont({
  src: '../../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2',
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'UMCine | 영화 목록', template: '%s | UMCine' },
  description: '인기 영화를 검색하고 즐겨찾기와 나만의 평점을 남겨 보세요.',
  openGraph: {
    title: 'UMCine',
    description: '영화와 함께하는 하루',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable}>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:p-3">
              본문으로 건너뛰기
            </a>
            <Header />
            <StorageNotice />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
