import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const undefinedStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => typeof window === "undefined" ? undefinedStorage : window.localStorage),
      skipHydration: true,
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);