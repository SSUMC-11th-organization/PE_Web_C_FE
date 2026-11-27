'use client';

import { useViewSettingsStore } from '../../stores/view-settings-store';

export function ViewSettings() {
  const sortOrder = useViewSettingsStore((state) => state.sortOrder);
  const setSortOrder = useViewSettingsStore((state) => state.setSortOrder);
  return (
    <div className="mb-6 rounded-xl border border-line bg-white p-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-bold">
          현재 페이지 정렬
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
      </div>
      <p role="status" className="mt-3 text-xs leading-5 text-muted">
        즐겨찾기는 로그인한 회원의 서버 데이터로 관리해요. 정렬·즐겨찾기 필터는 현재 영화 페이지에
        적용돼요.
      </p>
    </div>
  );
}
