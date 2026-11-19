import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { addFavorite, getFavoriteStatus, removeFavorite } from "../../api/favorites";
import { useAuthStore } from "../../stores/auth-store";

export function FavoriteButton({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const queryKey = ["favorites", accessToken, "detail", movieId] as const;
  const favorite = useQuery({
    queryKey,
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const toggle = useMutation({
    mutationFn: (isFavorite: boolean) =>
      isFavorite ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: (_, wasFavorite) => {
      queryClient.setQueryData(queryKey, !wasFavorite);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["favorites", accessToken] }),
  });

  if (!accessToken) return <Link to="/login">로그인하고 즐겨찾기</Link>;
  if (favorite.isPending) return <p role="status">즐겨찾기를 확인하는 중이에요.</p>;
  if (favorite.isError) {
    return <button type="button" onClick={() => void favorite.refetch()}>
      즐겨찾기 다시 불러오기
    </button>;
  }

  return (
    <div>
      <button
        className="primary-link"
        type="button"
        aria-pressed={favorite.data}
        disabled={toggle.isPending}
        onClick={() => toggle.mutate(favorite.data)}
      >
        {toggle.isPending ? "저장 중" : favorite.data ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      </button>
      {toggle.isError && <p role="alert">즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.</p>}
    </div>
  );
}
