import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { FormField, primaryButton, secondaryButton } from '../../components/auth/form-ui';
import { ProfileAvatar } from '../../components/my/profile-avatar';
import { useProfilePreviewStore } from '../../stores/profile-preview-store';
import { isEmailValid, isNicknameValid } from '../../utils/auth/validation';

export function ProfileEditPage() {
  const { profile, updateProfile } = useProfilePreviewStore();
  const [form, setForm] = useState(profile);
  const [message, setMessage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const navigate = useNavigate();
  const valid = isNicknameValid(form.nickname) && isEmailValid(form.email);
  const changed =
    form.nickname.trim() !== profile.nickname ||
    form.email.trim() !== profile.email ||
    form.image !== profile.image;
  return (
    <section className="mx-auto flex min-h-[700px] max-w-[1600px] flex-col px-5 py-8 lg:px-20">
      <title>UMCine | 내 정보 수정</title>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">내 정보 수정</h1>
          <p className="mt-2 text-sm text-muted">닉네임과 프로필 이미지를 변경할 수 있어요.</p>
        </div>
        <button
          type="button"
          className={primaryButton}
          onClick={() => setMessage('비밀번호 변경은 준비 중이에요.')}
        >
          비밀번호 변경
        </button>
      </div>
      <form
        className="mb-12 grid gap-8 md:grid-cols-[1fr_2fr]"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!valid || !changed || imageLoading) return;
          updateProfile(form);
          void navigate({ to: '/my' });
        }}
      >
        <div className="flex flex-col items-center gap-3 pt-2">
          <ProfileAvatar nickname={form.nickname} image={form.image} />
          <label
            htmlFor="profile-image"
            className="cursor-pointer text-sm font-bold underline underline-offset-4"
          >
            프로필 이미지
          </label>
          <input
            id="profile-image"
            aria-label="프로필 이미지 선택"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="max-w-full text-xs"
            disabled={imageLoading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (
                !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
                file.size > 5 * 1024 * 1024
              ) {
                setMessage('PNG, JPG, WebP 이미지를 5MB 이하로 선택해 주세요.');
                event.target.value = '';
                return;
              }
              setImageLoading(true);
              const reader = new FileReader();
              reader.onload = () => {
                const image = reader.result;
                if (typeof image === 'string') setForm((current) => ({ ...current, image }));
                setImageLoading(false);
                setMessage('이미지를 확인한 뒤 수정하기를 눌러 주세요.');
              };
              reader.onerror = () => {
                setImageLoading(false);
                setMessage('이미지를 읽지 못했어요. 다시 선택해 주세요.');
              };
              reader.readAsDataURL(file);
            }}
          />
          <p className="text-xs text-muted">PNG, JPG, WebP · 최대 5MB</p>
        </div>
        <div className="space-y-6">
          <FormField
            id="profile-nickname"
            label="닉네임"
            value={form.nickname}
            maxLength={24}
            autoComplete="nickname"
            onChange={(event) =>
              setForm((current) => ({ ...current, nickname: event.target.value }))
            }
            error={!isNicknameValid(form.nickname) ? '닉네임은 2~12자로 입력해 주세요.' : undefined}
            action={
              <button
                type="button"
                className={secondaryButton}
                disabled={!isNicknameValid(form.nickname)}
                onClick={() =>
                  setMessage(
                    '프로필 수정의 중복 확인은 준비 중이에요. 이번에는 예시 정보만 변경할 수 있어요.',
                  )
                }
              >
                중복 확인
              </button>
            }
          />
          <FormField
            id="profile-email"
            label="이메일"
            type="email"
            value={form.email}
            autoComplete="email"
            maxLength={254}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            error={!isEmailValid(form.email) ? '올바른 이메일 형식으로 입력해 주세요.' : undefined}
          />
          <p className="text-xs leading-5 text-muted">
            예시 프로필에만 반영돼요. 새로고침하면 초기화돼요.
          </p>
          <div className="flex gap-3">
            <Link to="/my" className={`${secondaryButton} flex-1`}>
              취소
            </Link>
            <button
              type="submit"
              className={`${primaryButton} flex-1`}
              disabled={!valid || !changed || imageLoading}
            >
              수정하기
            </button>
          </div>
        </div>
      </form>
      {message && (
        <p role="status" className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          {message}
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-5">
        <div>
          <h2 className="text-sm font-bold text-red-700">회원 탈퇴</h2>
          <p className="mt-1 text-xs text-red-700">
            탈퇴 시 계정 정보가 삭제돼요. 현재는 화면만 제공해요.
          </p>
        </div>
        <button
          type="button"
          className={secondaryButton}
          onClick={() => setMessage('회원 탈퇴는 준비 중이에요. 계정 정보는 삭제되지 않았어요.')}
        >
          회원 탈퇴
        </button>
      </div>
    </section>
  );
}
