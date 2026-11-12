import { createFileRoute } from '@tanstack/react-router';
import { ProfilePage } from '../pages/my/profile-page';
export const Route = createFileRoute('/my/')({ component: ProfilePage });
