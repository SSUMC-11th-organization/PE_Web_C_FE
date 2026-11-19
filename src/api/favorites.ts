import { authApi } from "./auth-api";

interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export async function getFavorites() {
  const response = await authApi.get("favorites").json<{ result: Favorite[] }>();
  return response.result;
}

export async function getFavoriteStatus(movieId: number) {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<{ result: { isFavorite: boolean } }>();
  return response.result.isFavorite;
}

export async function addFavorite(movieId: number) {
  await authApi.post("favorites", { json: { movieId } });
}

export async function removeFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`, { retry: 0 });
}
