import type { ReactNode } from "react";
import { AuthGate } from "../auth-gate";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
