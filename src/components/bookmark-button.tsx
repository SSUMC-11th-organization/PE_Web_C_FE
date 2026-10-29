import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
  <button
    type="button"
    className="absolute top-2 right-2 z-10 rounded bg-blue-600 p-2 text-white"
    onClick={() => toggleBookmark(movieId)}
  >
    {isBookmarked ? "북마크 해제" : "북마크 추가"}
  </button>
);
}