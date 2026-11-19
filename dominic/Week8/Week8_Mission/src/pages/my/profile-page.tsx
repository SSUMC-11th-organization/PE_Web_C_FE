import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { primaryButton } from '../../components/auth/form-ui';
import { BookmarkedMovies } from '../../components/my/bookmarked-movies';
import { ProfileAvatar } from '../../components/my/profile-avatar';
import { accountQueries } from '../../queries/account';
import { useAuthStore } from '../../stores/auth-store';

export function ProfilePage() {
  const { accessToken, session } = useAuthStore();
  const { data: profile } = useQuery(accountQueries.me(session, !!accessToken));
  if (!profile) return null;
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-8 lg:px-20">
      <title>UMCine | 내 정보</title>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">내 정보</h1>
        <Link to="/my/edit" className={primaryButton}>
          정보 수정
        </Link>
      </div>
      <h2 className="mb-4 text-lg font-bold">기본 정보</h2>
      <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-line pb-7">
        <ProfileAvatar nickname={profile.nickname} image="" />
        <dl className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <dt className="mb-2 text-xs text-muted">닉네임</dt>
            <dd className="break-all font-bold">{profile.nickname}</dd>
          </div>
          <div>
            <dt className="mb-2 text-xs text-muted">이메일</dt>
            <dd className="break-all font-bold">{profile.email}</dd>
          </div>
          <div>
            <dt className="mb-2 text-xs text-muted">가입일</dt>
            <dd className="font-bold">{profile.createdAt.slice(0, 10)}</dd>
          </div>
        </dl>
      </div>
      <h2 className="mb-4 text-lg font-bold">내 즐겨찾기</h2>
      <BookmarkedMovies />
    </section>
  );
}
