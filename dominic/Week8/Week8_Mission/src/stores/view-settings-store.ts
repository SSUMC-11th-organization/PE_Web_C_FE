import { create } from 'zustand';
import type { StateStorage } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { createValidatedStorage, isRecord, localBrowserStorage } from '../utils/browser-storage';

export type SortOrder = 'default' | 'title' | 'newest';
export const VIEW_SETTINGS_KEY = 'umcine-view-settings';
interface ViewSettingsData {
  sortOrder: SortOrder;
}
interface ViewSettingsStore extends ViewSettingsData {
  setSortOrder: (order: SortOrder) => void;
}

function isSortOrder(value: unknown): value is SortOrder {
  return value === 'default' || value === 'title' || value === 'newest';
}
function validateSettings(value: unknown): ViewSettingsData {
  return {
    sortOrder: isRecord(value) && isSortOrder(value.sortOrder) ? value.sortOrder : 'default',
  };
}

export function createViewSettingsStore(storage: StateStorage = localBrowserStorage) {
  return create<ViewSettingsStore>()(
    persist(
      (set) => ({
        sortOrder: 'default',
        setSortOrder: (sortOrder) => {
          if (isSortOrder(sortOrder)) set({ sortOrder });
        },
      }),
      {
        name: VIEW_SETTINGS_KEY,
        storage: createValidatedStorage(storage, validateSettings),
        partialize: (state) => ({ sortOrder: state.sortOrder }),
        merge: (saved, current) => ({ ...current, ...validateSettings(saved) }),
      },
    ),
  );
}

export const useViewSettingsStore = createViewSettingsStore();
