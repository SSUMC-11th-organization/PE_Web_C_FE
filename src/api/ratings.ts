import { apiClient } from "./api-client";
import { authApi } from "./auth-api";
import type { RatingResponse } from "./members/member-api";

interface RatingInput {
  score: number;
  comment?: string;
}

export function getRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<RatingResponse[]>();
}

export async function createRating(movieId: number, rating: RatingInput) {
  await authApi.post("ratings", { json: { movieId, ...rating } });
}

export async function updateRating(ratingId: number, rating: RatingInput) {
  await authApi.patch(`ratings/${ratingId}`, { json: rating });
}

export async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`, { retry: 0 });
}
