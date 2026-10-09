import { useState } from 'react';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { ViewSettings } from '../../components/movies/view-settings';
import { movies } from '../../data/movies';
import { useBookmarkStore } from '../../stores/bookmark-store';
import { useViewSettingsStore } from '../../stores/view-settings-store';
import { sortMovies } from '../../utils/movie-sort';

export function MovieListPage() {
  const bookmarkedIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const sortOrder = useViewSettingsStore((state) => state.sortOrder);
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const visibleMovies = sortMovies(
    bookmarksOnly ? movies.filter((movie) => bookmarkedIds.includes(movie.id)) : movies,
    sortOrder,
  );
  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-6 pb-12 lg:px-20">
      <title>UMCine | 영화 목록</title>
      <h1 className="mb-5 text-[32px] leading-[44px] font-bold tracking-[-1.71px] sm:text-[38px]">
        영화 목록
      </h1>
      <ViewSettings />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 font-bold">
          <input
            type="checkbox"
            checked={bookmarksOnly}
            onChange={(event) => setBookmarksOnly(event.target.checked)}
            className="size-4 accent-primary"
          />
          북마크만 보기
        </label>
        <span className="text-subtle" aria-live="polite">
          영화 {visibleMovies.length}편
        </span>
      </div>
      {visibleMovies.length ? (
        <MovieGrid movies={visibleMovies} />
      ) : (
        <p className="rounded-xl border border-line bg-white px-5 py-20 text-center text-muted">
          아직 북마크한 영화가 없어요. 영화의 즐겨찾기 버튼을 눌러보세요.
        </p>
      )}
      {!bookmarksOnly && <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />}
    </section>
  );
}
