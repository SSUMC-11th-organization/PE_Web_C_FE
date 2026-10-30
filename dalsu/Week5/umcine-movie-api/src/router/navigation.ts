import { useSyncExternalStore } from "react";

// 라우터 라이브러리 없이 주소(URL)를 읽고 이동하는 아주 작은 도구입니다.
const NAVIGATE_EVENT = "umcine:navigate";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(NAVIGATE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(NAVIGATE_EVENT, callback);
  };
}

function getSnapshot() {
  return window.location.pathname + window.location.search;
}

export function navigate(to: string) {
  window.history.pushState(null, "", to);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function useLocation() {
  const href = useSyncExternalStore(subscribe, getSnapshot);
  const url = new URL(href, window.location.origin);
  return { pathname: url.pathname, searchParams: url.searchParams };
}
