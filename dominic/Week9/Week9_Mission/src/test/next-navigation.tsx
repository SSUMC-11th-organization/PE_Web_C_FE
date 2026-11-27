import { AuthenticatedLayout } from '../components/auth/authenticated-layout';
import { GuestOnly } from '../components/auth/guest-only';
import { SessionBoundary } from '../components/auth/session-boundary';
import { Footer } from '../components/layout/footer';
import { Header } from '../components/layout/header';
import { LoginPage } from '../screens/auth/login-page';
import { SignupPage } from '../screens/auth/signup-page';
import { MovieDetailPage } from '../screens/movies/movie-detail-page';
import { MovieListPage } from '../screens/movies/movie-list-page';
import { MovieSearchPage } from '../screens/movies/movie-search-page';
import { ProfileEditPage } from '../screens/my/profile-edit-page';
import { ProfilePage } from '../screens/my/profile-page';
import { NotFoundPage } from '../screens/not-found-page';
import { validateMovieListSearch, validateMovieSearch } from '../utils/movies/route-search';

export { navigation } from './navigation-controller';

import { useUrl } from './navigation-controller';
// Component harness only. Real Next route resolution is verified with the production server.
export function TestApp() {
  const url = useUrl();
  const search = Object.fromEntries(url.searchParams);
  let page: React.ReactNode;
  if (url.pathname === '/')
    page = <MovieListPage key={url.search} {...validateMovieListSearch(search)} />;
  else if (url.pathname === '/search')
    page = <MovieSearchPage key={url.search} {...validateMovieSearch(search)} />;
  else if (url.pathname.startsWith('/movies/'))
    page = <MovieDetailPage movieId={url.pathname.split('/')[2] ?? ''} />;
  else if (url.pathname === '/login')
    page = (
      <GuestOnly>
        <LoginPage />
      </GuestOnly>
    );
  else if (url.pathname === '/signup') page = <SignupPage />;
  else if (url.pathname.startsWith('/my'))
    page = (
      <AuthenticatedLayout>
        {url.pathname === '/my/edit' ? <ProfileEditPage /> : <ProfilePage />}
      </AuthenticatedLayout>
    );
  else page = <NotFoundPage />;
  return (
    <>
      <SessionBoundary />
      <Header />
      <main>{page}</main>
      <Footer />
    </>
  );
}
