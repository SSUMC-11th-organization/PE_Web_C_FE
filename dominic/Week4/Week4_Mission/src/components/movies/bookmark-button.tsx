import { useBookmarkStore } from '../../stores/bookmark-store';
import type { Movie } from '../../types/movie';
import { cn } from '../../utils/cn';
import { Icon } from '../layout/icon';

export function BookmarkButton({ movie, iconOnly = false }: { movie: Movie; iconOnly?: boolean }) {
  // boolean과 action만 구독해 다른 영화의 북마크 변경으로 불필요하게 다시 그리지 않아요.
  const bookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movie.id));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  return (
    <button
      type="button"
      aria-label={`${movie.title} 즐겨찾기${bookmarked ? ' 해제' : ''}`}
      aria-pressed={bookmarked}
      onClick={() => toggleBookmark(movie.id)}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border text-sm font-bold',
        iconOnly
          ? 'absolute top-2.5 right-2.5 size-[34px] border-white bg-ink text-white'
          : 'h-[42px] border-primary bg-primary px-4 text-white',
        bookmarked && (iconOnly ? 'border-primary bg-primary' : 'border-ink bg-ink'),
      )}
    >
      <Icon name={bookmarked ? 'bookmark' : 'bookmark-outline'} small={!iconOnly} inverted />
      {!iconOnly && (bookmarked ? '즐겨찾기 해제' : '즐겨찾기')}
    </button>
  );
}
