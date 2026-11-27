import { requestTmdb, TmdbUpstreamError } from '@/server/tmdb';
export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const body = await requestTmdb(
      (await params).path.join('/'),
      new URL(request.url).searchParams,
      request.signal,
    );
    return Response.json(body);
  } catch (error) {
    const status = error instanceof TmdbUpstreamError ? error.status : 502;
    return Response.json({ message: '영화 데이터를 불러오지 못했어요.' }, { status });
  }
}
