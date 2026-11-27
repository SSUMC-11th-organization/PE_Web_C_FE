import type { Metadata } from 'next';
import { AuthenticatedLayout } from '@/components/auth/authenticated-layout';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
