import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites";
import { getMe } from "../api/members/me";
import { getRatings } from "../api/ratings";
import { useAuthStore } from "../stores/auth-store";

export const meQueryKey = ["members", "me"] as const;

export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ["favorites", accessToken, "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}

function getMemberId(accessToken: string | null) {
  const encodedPayload = accessToken?.split(".")[1];
  if (!encodedPayload) return null;

  try {
    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const { sub, memberId, id } = JSON.parse(atob(base64));
    const value = memberId ?? sub ?? id;
    const parsedId = typeof value === "string" ? Number(value) : value;
    return Number.isSafeInteger(parsedId) && parsedId > 0 ? Number(parsedId) : null;
  } catch {
    return null;
  }
}

export function useRatingsQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const query = useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => {
      if (memberId === null) throw new Error("회원 번호를 확인할 수 없어요.");
      return getRatings(memberId);
    },
    enabled: memberId !== null,
    retry: false,
  });

  return { memberId, query };
}
