import { useBookmarkStore } from "../stores/bookmark-store";

export function BookmarkButton({ movieId }: { movieId: number }) {
  const isBookmarked = useBookmarkStore((s) => s.bookmarkedMovieIds.includes(movieId));
  const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark);
  return <button type="button" className={`bookmark-button ${isBookmarked ? "is-active" : ""}`} aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"} aria-pressed={isBookmarked} onClick={() => toggleBookmark(movieId)}>
    <svg width="17" height="20" viewBox="0 0 18 22" fill="none" aria-hidden="true"><path d="M3 2h12v18l-6-4-6 4V2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill={isBookmarked ? "currentColor" : "none"} /></svg>
  </button>;
}
