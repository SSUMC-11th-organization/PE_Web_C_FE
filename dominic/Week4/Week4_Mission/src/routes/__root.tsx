import { createRootRoute } from '@tanstack/react-router';
import { RootLayout } from '../components/layout/root-layout';
import { NotFoundPage } from '../pages/not-found-page';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});
