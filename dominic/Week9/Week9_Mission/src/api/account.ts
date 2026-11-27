import { isRecord } from '../utils/browser-storage';
import { apiClient } from './api-client';
import { authApi } from './auth-api';

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}
export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
}
export interface RatingInput {
  movieId: number;
  score: number;
  comment?: string | null;
}
function positiveId(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}
export function resultOf(body: unknown): unknown {
  if (!isRecord(body) || body.isSuccess !== true || !('result' in body)) {
    throw new Error(
      isRecord(body) && typeof body.message === 'string'
        ? body.message
        : '서버 응답 형식을 확인해 주세요.',
    );
  }
  return body.result;
}
function memberOf(body: unknown): MemberInfo {
  const member = resultOf(body);
  if (
    !isRecord(member) ||
    typeof member.email !== 'string' ||
    typeof member.nickname !== 'string' ||
    typeof member.createdAt !== 'string'
  )
    throw new Error('회원 정보 응답 형식을 확인해 주세요.');
  return { email: member.email, nickname: member.nickname, createdAt: member.createdAt };
}
export async function login(body: { email: string; password: string }) {
  const data = resultOf(
    await apiClient
      .post('auth/login', { json: { email: body.email.trim(), password: body.password } })
      .json(),
  );
  if (
    !isRecord(data) ||
    typeof data.accessToken !== 'string' ||
    !data.accessToken.trim() ||
    typeof data.nickname !== 'string'
  )
    throw new Error('로그인 응답 형식을 확인해 주세요.');
  return { accessToken: data.accessToken, nickname: data.nickname };
}
export const getMe = async (signal?: AbortSignal) =>
  memberOf(await authApi.get('members/me', { signal }).json());
export const updateMe = async (body: { nickname: string }) =>
  memberOf(await authApi.patch('members/me', { json: { nickname: body.nickname.trim() } }).json());

export async function getFavorites(signal?: AbortSignal): Promise<number[]> {
  const data = resultOf(await authApi.get('favorites', { signal }).json());
  const items: unknown = isRecord(data) ? (data.movieIds ?? data.content) : data;
  if (!Array.isArray(items)) throw new Error('즐겨찾기 목록 응답 형식을 확인해 주세요.');
  return [
    ...new Set(
      items.map((item: unknown) => {
        const id: unknown = isRecord(item) ? item.movieId : item;
        if (!positiveId(id)) throw new Error('즐겨찾기 영화 번호를 확인해 주세요.');
        return id;
      }),
    ),
  ];
}
export async function getFavorite(movieId: number, signal?: AbortSignal): Promise<boolean> {
  const data = resultOf(await authApi.get(`favorites/${movieId}`, { signal }).json());
  const value = isRecord(data) ? data.isFavorite : data;
  if (typeof value !== 'boolean') throw new Error('즐겨찾기 상태 응답 형식을 확인해 주세요.');
  return value;
}
export async function changeFavorite({
  movieId,
  favorite,
}: {
  movieId: number;
  favorite: boolean;
}) {
  const response = favorite
    ? await authApi.post('favorites', { json: { movieId } })
    : await authApi.delete(`favorites/${movieId}`);
  if (response.status !== 204) resultOf(await response.json());
  return { movieId, favorite };
}
export async function getRatings(memberId: number, signal?: AbortSignal): Promise<Rating[]> {
  const data = resultOf(await authApi.get(`members/${memberId}/ratings`, { signal }).json());
  const items: unknown = isRecord(data) ? data.content : data;
  if (!Array.isArray(items)) throw new Error('평점 목록 응답 형식을 확인해 주세요.');
  return items.map((item: unknown) => {
    if (
      !isRecord(item) ||
      !positiveId(item.ratingId) ||
      !positiveId(item.movieId) ||
      typeof item.score !== 'number' ||
      !Number.isInteger(item.score) ||
      item.score < 1 ||
      item.score > 5 ||
      (item.comment !== null && typeof item.comment !== 'string')
    )
      throw new Error('평점 응답 형식을 확인해 주세요.');
    return {
      ratingId: item.ratingId,
      movieId: item.movieId,
      score: item.score,
      comment: item.comment,
    };
  });
}
export async function saveRating({ ratingId, ...input }: RatingInput & { ratingId?: number }) {
  const json = ratingId
    ? { score: input.score, comment: input.comment ?? null }
    : { movieId: input.movieId, score: input.score, comment: input.comment ?? null };
  resultOf(
    await (ratingId
      ? authApi.patch(`ratings/${ratingId}`, { json })
      : authApi.post('ratings', { json })
    ).json(),
  );
}
export async function deleteRating(ratingId: number) {
  const response = await authApi.delete(`ratings/${ratingId}`);
  if (response.status !== 204) resultOf(await response.json());
}
