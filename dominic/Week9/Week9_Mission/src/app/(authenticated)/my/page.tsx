import type { Metadata } from 'next';
import { ProfilePage } from '@/screens/my/profile-page';
export const metadata: Metadata = { title: '내 정보' };
export default function Page() {
  return <ProfilePage />;
}
