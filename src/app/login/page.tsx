import { LoginPage } from "@/screens/auth/login-page";
import { AuthGate } from "../auth-gate";

export default function Page() {
  return <AuthGate guestOnly><LoginPage /></AuthGate>;
}
