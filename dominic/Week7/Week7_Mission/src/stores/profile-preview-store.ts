import { create } from 'zustand';

export const defaultProfile = { email: 'dominic@example.com', nickname: 'Dominic', image: '' };
// 인증된 회원 데이터가 아닌 퍼블리싱용 메모리 상태예요. 새로고침하면 초기화돼요.
export const useProfilePreviewStore = create<{
  profile: typeof defaultProfile;
  updateProfile: (profile: typeof defaultProfile) => void;
}>((set) => ({
  profile: defaultProfile,
  updateProfile: (profile) =>
    set({
      profile: { ...profile, email: profile.email.trim(), nickname: profile.nickname.trim() },
    }),
}));
