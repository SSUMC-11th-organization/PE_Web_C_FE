import { createJSONStorage, type PersistStorage, type StateStorage } from 'zustand/middleware';

export type StorageMode = 'local' | 'session';

let storageFailed = false;
const listeners = new Set<() => void>();

function reportStorageFailure() {
  if (storageFailed) return;
  storageFailed = true;
  for (const listener of listeners) listener();
}

export const getStorageFailure = () => storageFailed;
export const getServerStorageFailure = () => false;
export function subscribeStorageFailure(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// 저장소 접근 자체와 메서드 호출 모두 SecurityError / QuotaExceededError가 날 수 있어요.
export function createSafeStateStorage(getStorage: () => StateStorage | undefined): StateStorage {
  return {
    getItem(name) {
      try {
        return getStorage()?.getItem(name) ?? null;
      } catch {
        reportStorageFailure();
        return null;
      }
    },
    setItem(name, value) {
      try {
        getStorage()?.setItem(name, value);
      } catch {
        reportStorageFailure();
      }
    },
    removeItem(name) {
      try {
        getStorage()?.removeItem(name);
      } catch {
        reportStorageFailure();
      }
    },
  };
}

export const localBrowserStorage = createSafeStateStorage(() =>
  typeof window === 'undefined' ? undefined : window.localStorage,
);
export const sessionBrowserStorage = createSafeStateStorage(() =>
  typeof window === 'undefined' ? undefined : window.sessionStorage,
);

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// JSON 변환은 createJSONStorage, 복원할 데이터의 모양 검증은 validate가 담당해요.
export function createValidatedStorage<T>(
  storage: StateStorage,
  validate: (state: unknown) => T,
): PersistStorage<T> {
  const jsonStorage = createJSONStorage<unknown>(() => storage);
  return {
    getItem(name) {
      try {
        const saved = jsonStorage?.getItem(name);
        if (!isRecord(saved) || !('state' in saved)) return null;
        if (saved.version !== undefined && saved.version !== 0) return null;
        return { state: validate(saved.state), version: 0 };
      } catch {
        // 잘못된 JSON은 앱을 중단시키지 않고 초기 빈 상태로 복원해요.
        return null;
      }
    },
    setItem(name, value) {
      return jsonStorage?.setItem(name, value);
    },
    removeItem(name) {
      return jsonStorage?.removeItem(name);
    },
  };
}
