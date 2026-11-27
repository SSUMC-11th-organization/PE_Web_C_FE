import { RequestLoading } from '@/components/movies/request-feedback';
export default function Loading() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-12 lg:px-20">
      <RequestLoading />
    </section>
  );
}
