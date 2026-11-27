import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createValidatedStorage, isRecord, localBrowserStorage } from '../utils/browser-storage';

interface AuthState {
  accessToken: string | null;
  session: number;
  setAccessToken: (token: string | null) => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      session: 0,
      setAccessToken: (token) =>
        set((state) => ({ accessToken: token, session: state.session + 1 })),
    }),
    {
      name: 'umcine-week9-auth',
      skipHydration: true,
      storage: createValidatedStorage(localBrowserStorage, (value) => ({
        accessToken:
          isRecord(value) && typeof value.accessToken === 'string' && value.accessToken.trim()
            ? value.accessToken
            : null,
      })),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);

// sub는 공개 평점 조회 대상을 정하는 용도로만 읽어요. 인증 검증은 서버가 해요.
export function getMemberId(token: string | null): number | null {
  try {
    const part = token?.split('.')[1];
    if (!part) return null;
    const body: unknown = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
    if (!isRecord(body) || !/^[1-9]\d*$/.test(String(body.sub))) return null;
    const id = Number(body.sub);
    return Number.isSafeInteger(id) ? id : null;
  } catch {
    return null;
  }
}
