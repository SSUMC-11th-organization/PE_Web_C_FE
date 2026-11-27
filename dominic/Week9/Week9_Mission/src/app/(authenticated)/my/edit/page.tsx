import type { Metadata } from 'next';
import { ProfileEditPage } from '@/screens/my/profile-edit-page';
export const metadata: Metadata = { title: '내 정보 수정' };
export default function Page() {
  return <ProfileEditPage />;
}
