"use client";

import { useSyncExternalStore, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";

function subscribe(onChange: () => void) {
  return useAuthStore.persist.onFinishHydration(onChange);
}

export function AuthGate({ children, guestOnly = false }: {
  children: ReactNode;
  guestOnly?: boolean;
}) {
  const hydrated = useSyncExternalStore(subscribe, useAuthStore.persist.hasHydrated, () => false);
  const token = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  const destination = guestOnly ? (token ? "/" : null) : (token ? null : "/login");

  useEffect(() => {
    if (hydrated && destination) router.replace(destination);
  }, [destination, hydrated, router]);

  if (!hydrated || destination) return <main role="status">로그인 상태 확인 중…</main>;
  return children;
}
