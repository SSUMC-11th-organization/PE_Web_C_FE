import { createFileRoute } from '@tanstack/react-router';
import { ProfileEditPage } from '../pages/my/profile-edit-page';
export const Route = createFileRoute('/my/edit')({ component: ProfileEditPage });
