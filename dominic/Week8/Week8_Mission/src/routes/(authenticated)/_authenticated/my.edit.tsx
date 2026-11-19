import { createFileRoute } from '@tanstack/react-router';
import { ProfileEditPage } from '../../../pages/my/profile-edit-page';
export const Route = createFileRoute('/(authenticated)/_authenticated/my/edit')({
  component: ProfileEditPage,
});
