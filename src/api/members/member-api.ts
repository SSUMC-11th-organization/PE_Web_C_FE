const MEMBER_API_BASE_URL = "http://localhost:8080";

export interface AvailabilityResponse {
  available: boolean;
}

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${MEMBER_API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`요청에 실패했어요. (${response.status})`);
  }

  return response.json();
}

export function checkNickname(nickname: string) {
  return request<AvailabilityResponse>(
    `/members/nickname/${encodeURIComponent(nickname)}`,
  );
}

export function checkEmail(email: string) {
  return request<AvailabilityResponse>(
    `/members/email/${encodeURIComponent(email)}`,
  );
}

export function getMemberRatings(memberId: number) {
  return request<RatingResponse[]>(
    `/members/${memberId}/ratings`,
  );
}