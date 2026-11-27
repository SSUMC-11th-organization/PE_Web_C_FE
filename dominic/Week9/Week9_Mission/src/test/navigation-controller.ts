import { useSyncExternalStore } from 'react';

let href = '/';
const listeners = new Set<() => void>();
function notify() {
  for (const listener of listeners) listener();
}
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
const snapshot = () => href;
export const useUrl = () =>
  new URL(useSyncExternalStore(subscribe, snapshot, snapshot), 'http://localhost');
const router = {
  push: (url: string) => {
    href = url;
    notify();
  },
  replace: (url: string) => {
    href = url;
    notify();
  },
  refresh: () => {},
  prefetch: () => {},
};
export const navigation = {
  reset(url: string) {
    href = url;
  },
  get state() {
    const url = new URL(href, 'http://localhost');
    const search = Object.fromEntries(url.searchParams);
    return {
      location: {
        pathname: url.pathname,
        href,
        search: { ...search, ...(search.page ? { page: Number(search.page) } : {}) },
      },
    };
  },
};
export const nextNavigation = { useRouter: () => router, usePathname: () => useUrl().pathname };
