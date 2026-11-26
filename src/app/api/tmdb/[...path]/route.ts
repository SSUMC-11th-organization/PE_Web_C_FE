import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const endpoint = (await params).path.join("/");
  if (!/^(movie\/(popular|[0-9]+)|search\/movie)$/.test(endpoint)) {
    return Response.json({ message: "영화 API 경로를 찾을 수 없어요." }, { status: 404 });
  }

  const baseUrl = process.env.TMDB_API_BASE_URL || process.env.VITE_TMDB_API_BASE_URL;
  const token = process.env.TMDB_ACCESS_TOKEN || process.env.VITE_TMDB_ACCESS_TOKEN;
  if (!baseUrl || !token) {
    return Response.json({ message: "TMDB 환경 변수가 필요해요." }, { status: 503 });
  }

  try {
    const url = new URL(endpoint, baseUrl.replace(/\/$/, "") + "/");
    url.search = request.nextUrl.search;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
    });
  } catch {
    return Response.json({ message: "영화 API에 연결하지 못했어요." }, { status: 502 });
  }
}
