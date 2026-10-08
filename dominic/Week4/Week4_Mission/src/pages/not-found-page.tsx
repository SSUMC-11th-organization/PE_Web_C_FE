import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <section className="px-5 py-24 text-center">
      <title>UMCine | 페이지 없음</title>
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <Link to="/" className="mt-6 inline-block text-primary underline">
        영화 목록으로 돌아가기
      </Link>
    </section>
  );
}
