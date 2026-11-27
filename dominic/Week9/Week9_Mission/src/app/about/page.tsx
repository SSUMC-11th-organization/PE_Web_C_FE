import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: '서비스 소개' };
export default function Page() {
  return (
    <section className="mx-auto max-w-2xl space-y-5 px-5 py-16">
      <h1 className="text-3xl font-bold">영화와 함께하는 하루, UMCine</h1>
      <p className="leading-7 text-muted">
        인기 영화를 둘러보고 제목으로 검색해 보세요. 로그인하면 좋아하는 영화를 즐겨찾기에 담고
        평점과 후기를 남길 수 있어요.
      </p>
      <Link href="/" className="inline-block rounded-lg bg-primary px-5 py-3 font-bold text-white">
        영화 둘러보기
      </Link>
    </section>
  );
}
