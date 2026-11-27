import { describe, expect, it } from 'vitest';
import { createTestStorage } from '../utils/test-storage';
import { createViewSettingsStore, VIEW_SETTINGS_KEY } from './view-settings-store';

describe('선택 미션: 화면 설정 저장', () => {
  it('초기 정렬은 기본순이다', () => {
    expect(createViewSettingsStore(createTestStorage()).getState().sortOrder).toBe('default');
  });
  it.each(['title', 'newest'] as const)(
    '%s 정렬을 새로고침과 새 탭에서도 복원한다',
    (sortOrder) => {
      const storage = createTestStorage();
      createViewSettingsStore(storage).getState().setSortOrder(sortOrder);
      expect(createViewSettingsStore(storage).getState().sortOrder).toBe(sortOrder);
      expect(JSON.parse(storage.getItem(VIEW_SETTINGS_KEY) ?? '')).toEqual({
        state: { sortOrder },
        version: 0,
      });
    },
  );
  it.each(['{broken', '{"state":{"sortOrder":"invalid"}}', '{"state":{"sortOrder":null}}'])(
    '잘못된 설정값 %s는 기본순으로 복원한다',
    (saved) => {
      const storage = createTestStorage({ [VIEW_SETTINGS_KEY]: saved });
      expect(createViewSettingsStore(storage).getState().sortOrder).toBe('default');
    },
  );
});
