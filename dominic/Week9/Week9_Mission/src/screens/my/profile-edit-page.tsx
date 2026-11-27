'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { MemberInfo } from '../../api/account';
import { FormField, primaryButton, secondaryButton } from '../../components/auth/form-ui';
import { AccountError } from '../../components/auth/request-error';
import { ProfileAvatar } from '../../components/my/profile-avatar';
import { accountMutations, accountQueries } from '../../queries/account';
import { useAuthStore } from '../../stores/auth-store';
import { isNicknameValid } from '../../utils/auth/validation';

export function ProfileEditPage() {
  const { accessToken, session } = useAuthStore();
  const { data } = useQuery(accountQueries.me(session, !!accessToken));
  return data ? <ProfileEditForm key={session} profile={data} session={session} /> : null;
}
function ProfileEditForm({ profile, session }: { profile: MemberInfo; session: number }) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [mode, setMode] = useState<'direct' | 'invalidate'>('direct');
  const locked = useRef(false);
  const client = useQueryClient();
  const router = useRouter();
  const mutation = useMutation(accountMutations.updateMe(client, session, mode));
  return (
    <section className="mx-auto min-h-[600px] max-w-[1600px] px-5 py-8 lg:px-20">
      <h1 className="mb-3 text-3xl font-bold tracking-tight">내 정보 수정</h1>
      <p className="mb-8 text-sm text-muted">새로운 닉네임으로 나를 표현해 보세요.</p>
      <form
        className="grid gap-8 md:grid-cols-[1fr_2fr]"
        noValidate
        aria-busy={mutation.isPending}
        onSubmit={(event) => {
          event.preventDefault();
          if (
            !isNicknameValid(nickname) ||
            mutation.isPending ||
            locked.current ||
            nickname.trim() === profile.nickname
          )
            return;
          locked.current = true;
          mutation.mutate(
            { nickname },
            {
              onSuccess: () => {
                if (useAuthStore.getState().session === session) router.push('/my');
              },
              onSettled: () => {
                locked.current = false;
              },
            },
          );
        }}
      >
        <div className="flex justify-center">
          <ProfileAvatar nickname={nickname} image="" />
        </div>
        <div className="space-y-6">
          <FormField
            id="profile-nickname"
            label="닉네임"
            value={nickname}
            maxLength={24}
            autoComplete="nickname"
            disabled={mutation.isPending}
            onChange={(event) => {
              setNickname(event.target.value);
              mutation.reset();
            }}
            error={!isNicknameValid(nickname) ? '닉네임은 2~12자로 입력해 주세요.' : undefined}
          />
          <FormField
            id="profile-email"
            label="이메일"
            type="email"
            value={profile.email}
            readOnly
            hint="이메일은 변경할 수 없어요."
          />
          <details className="rounded-lg border border-line p-3 text-xs text-muted">
            <summary className="cursor-pointer">학습용 · 캐시 갱신 방식 비교</summary>
            <label className="mt-3 block" htmlFor="cache-mode">
              갱신 방식
            </label>
            <select
              id="cache-mode"
              value={mode}
              disabled={mutation.isPending}
              onChange={(event) =>
                setMode(event.target.value === 'invalidate' ? 'invalidate' : 'direct')
              }
              className="mt-2 w-full rounded border border-line bg-white p-2"
            >
              <option value="direct">응답 데이터로 바로 갱신 (setQueryData)</option>
              <option value="invalidate">서버에서 다시 조회 (invalidateQueries)</option>
            </select>
          </details>
          {mutation.isError && <AccountError error={mutation.error} />}
          <div className="flex gap-3">
            <Link href="/my" className={`${secondaryButton} flex-1`}>
              취소
            </Link>
            <button
              type="submit"
              className={`${primaryButton} flex-1`}
              disabled={
                !isNicknameValid(nickname) ||
                nickname.trim() === profile.nickname ||
                mutation.isPending
              }
            >
              {mutation.isPending ? '저장 중' : '수정하기'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
