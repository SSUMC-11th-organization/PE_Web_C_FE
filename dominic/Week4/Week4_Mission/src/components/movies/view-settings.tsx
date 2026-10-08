import { useBookmarkStore } from '../../stores/bookmark-store';
import { useViewSettingsStore } from '../../stores/view-settings-store';

export function ViewSettings() {
  const storageMode = useBookmarkStore((state) => state.storageMode);
  const setStorageMode = useBookmarkStore((state) => state.setStorageMode);
  const clearBookmarks = useBookmarkStore((state) => state.clearBookmarks);
  const hasBookmarks = useBookmarkStore((state) => state.bookmarkedMovieIds.length > 0);
  const sortOrder = useViewSettingsStore((state) => state.sortOrder);
  const setSortOrder = useViewSettingsStore((state) => state.setSortOrder);
  return (
    <div className="mb-6 rounded-xl border border-line bg-white p-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-wrap items-center gap-2 text-sm font-bold">
          북마크 저장소
          <select
            value={storageMode}
            onChange={(event) =>
              setStorageMode(event.target.value === 'session' ? 'session' : 'local')
            }
            className="rounded-lg border border-line bg-page px-3 py-2 font-normal"
          >
            <option value="local">localStorage · 계속 유지</option>
            <option value="session">sessionStorage · 현재 탭만</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          영화 정렬
          <select
            value={sortOrder}
            onChange={(event) => {
              const order = event.target.value;
              if (order === 'default' || order === 'title' || order === 'newest')
                setSortOrder(order);
            }}
            className="rounded-lg border border-line bg-page px-3 py-2 font-normal"
          >
            <option value="default">기본순</option>
            <option value="title">제목순</option>
            <option value="newest">최신 개봉순</option>
          </select>
        </label>
        <button
          type="button"
          disabled={!hasBookmarks}
          onClick={clearBookmarks}
          title="현재 선택한 저장소의 북마크만 삭제합니다."
          className="rounded-lg border border-line px-3 py-2 text-sm text-muted enabled:hover:bg-page disabled:opacity-40"
        >
          북마크 초기화
        </button>
      </div>
      <p role="status" className="mt-3 text-xs leading-5 text-muted">
        {storageMode === 'local'
          ? '북마크는 다음 방문에도 유지돼요.'
          : '이 탭에서는 새로고침해도 유지되지만, 탭을 닫고 새로 열면 초기화돼요.'}{' '}
        두 저장소의 북마크는 별도로 관리해요. 영화 정렬은 항상 이 브라우저에 저장돼요.
      </p>
    </div>
  );
}
