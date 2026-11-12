// @vitest-environment jsdom
import { QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkEmailDuplicate, checkNicknameDuplicate, signup } from '../api/members/requests';
import { createQueryClient } from '../queries/client';
import { routeTree } from '../routeTree.gen';
import { useBookmarkStore } from '../stores/bookmark-store';
import { defaultProfile, useProfilePreviewStore } from '../stores/profile-preview-store';

vi.mock('../api/members/requests', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/members/requests')>()),
  checkEmailDuplicate: vi.fn(),
  checkNicknameDuplicate: vi.fn(),
  signup: vi.fn(),
}));
const emailMock = vi.mocked(checkEmailDuplicate),
  nicknameMock = vi.mocked(checkNicknameDuplicate),
  signupMock = vi.mocked(signup);
const success = {
  message: '회원가입에 성공했습니다.',
  result: { memberId: 1, email: 'dominic@example.com', nickname: 'Dominic' },
};
beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  useBookmarkStore.setState({ bookmarkedMovieIds: [] });
  useProfilePreviewStore.setState({ profile: defaultProfile });
  emailMock.mockResolvedValue(true);
  nicknameMock.mockResolvedValue(true);
  signupMock.mockResolvedValue(success);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
async function openPage(url: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [url] }),
    defaultPendingMinMs: 0,
  });
  await router.load();
  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}
const input = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } });
function fillSignup() {
  input('이메일', 'dominic@example.com');
  input('닉네임', 'Dominic');
  input('비밀번호', 'Test1234!');
  input('비밀번호 확인', 'Test1234!');
}
async function checkBoth() {
  fireEvent.click(screen.getByRole('button', { name: '이메일 중복 확인' }));
  fireEvent.click(screen.getByRole('button', { name: '닉네임 중복 확인' }));
  await screen.findByText('사용할 수 있는 이메일이에요.');
  await screen.findByText('사용할 수 있는 닉네임이에요.');
}

describe('7주차 회원 화면', () => {
  it('형식 오류·비밀번호 불일치·중복 확인 누락 시 가입을 차단한다', async () => {
    await openPage('/signup');
    fillSignup();
    expect((screen.getByRole('button', { name: '가입하기' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await checkBoth();
    expect((screen.getByRole('button', { name: '가입하기' }) as HTMLButtonElement).disabled).toBe(
      false,
    );
    input('비밀번호 확인', 'different');
    expect(screen.getByText('비밀번호가 일치하지 않아요.')).toBeTruthy();
    expect((screen.getByRole('button', { name: '가입하기' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    input('이메일', 'invalid');
    expect(screen.getByText('올바른 이메일 형식으로 입력해 주세요.')).toBeTruthy();
    expect(signupMock).not.toHaveBeenCalled();
  });
  it('확인 중 입력과 버튼을 잠그고 확인 후 수정 시 결과를 초기화한다', async () => {
    let resolve: ((value: boolean) => void) | undefined;
    emailMock.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    await openPage('/signup');
    fillSignup();
    fireEvent.click(screen.getByRole('button', { name: '이메일 중복 확인' }));
    expect((screen.getByLabelText('이메일', { exact: true }) as HTMLInputElement).disabled).toBe(
      true,
    );
    expect(
      (screen.getByRole('button', { name: '이메일 중복 확인' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    await act(async () => resolve?.(true));
    input('이메일', 'other@example.com');
    expect(screen.queryByText('사용할 수 있는 이메일이에요.')).toBeNull();
  });
  it('중복 응답과 네트워크 오류를 구분하고 다시 확인할 수 있다', async () => {
    emailMock.mockResolvedValueOnce(false).mockRejectedValueOnce(new TypeError('offline'));
    await openPage('/signup');
    fillSignup();
    fireEvent.click(screen.getByRole('button', { name: '이메일 중복 확인' }));
    await screen.findByText('이미 사용 중인 이메일이에요.');
    fireEvent.click(screen.getByRole('button', { name: '이메일 중복 확인' }));
    await screen.findByText(/회원 서버에 연결하지 못했어요/);
    fireEvent.click(screen.getByRole('button', { name: '이메일 중복 확인' }));
    await screen.findByText('사용할 수 있는 이메일이에요.');
  });
  it('가입 진행 중 연속 제출을 한 번만 처리하고 성공 메시지를 보여준다', async () => {
    let resolve: ((value: typeof success) => void) | undefined;
    signupMock.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    await openPage('/signup');
    fillSignup();
    await checkBoth();
    const form = screen.getByRole('button', { name: '가입하기' }).closest('form');
    if (!form) throw new Error('폼 없음');
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(signupMock).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('button', { name: '가입 중' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect((screen.getByLabelText('비밀번호', { exact: true }) as HTMLInputElement).disabled).toBe(
      true,
    );
    await act(async () => resolve?.(success));
    await screen.findByText('회원가입에 성공했습니다.');
    expect((screen.getByLabelText('비밀번호', { exact: true }) as HTMLInputElement).value).toBe('');
  });
  it('가입 실패 후 입력을 유지하고 재확인 후 다시 제출한다', async () => {
    signupMock.mockRejectedValueOnce(new Error('가입 실패'));
    await openPage('/signup');
    fillSignup();
    await checkBoth();
    fireEvent.click(screen.getByRole('button', { name: '가입하기' }));
    await screen.findByRole('alert');
    expect((screen.getByLabelText('비밀번호', { exact: true }) as HTMLInputElement).value).toBe(
      'Test1234!',
    );
    expect((screen.getByLabelText('이메일', { exact: true }) as HTMLInputElement).value).toBe(
      'dominic@example.com',
    );
    expect((screen.getByRole('button', { name: '가입하기' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await checkBoth();
    fireEvent.click(screen.getByRole('button', { name: '가입하기' }));
    await screen.findByText('회원가입에 성공했습니다.');
    expect(signupMock).toHaveBeenCalledTimes(2);
  });
  it('로그인 입력을 반영하지만 로그인 완료로 위장하거나 API를 호출하지 않는다', async () => {
    await openPage('/login');
    input('이메일', 'dominic@example.com');
    input('비밀번호', 'Test1234!');
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    await screen.findByText(/로그인 기능은 준비 중이에요/);
    expect(signupMock).not.toHaveBeenCalled();
  });
  it('내 정보 직접 접근·수정 반영·취소를 지원하고 전용 접근 제한이 없다', async () => {
    const router = await openPage('/my/edit');
    input('닉네임', '새도미닉');
    input('이메일', 'new@example.com');
    fireEvent.click(screen.getByRole('button', { name: '수정하기' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/my'));
    await screen.findByText('새도미닉');
    await screen.findByText('new@example.com');
    fireEvent.click(screen.getByRole('link', { name: '정보 수정' }));
    await screen.findByRole('heading', { name: '내 정보 수정' });
    input('닉네임', '저장안함');
    fireEvent.click(screen.getByRole('link', { name: '취소' }));
    await screen.findByText('새도미닉');
    expect(screen.queryByText('저장안함')).toBeNull();
  });
  it('프로필 이미지 파일 형식과 크기를 검사한다', async () => {
    await openPage('/my/edit');
    const file = new File(['invalid'], 'file.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('프로필 이미지 선택'), { target: { files: [file] } });
    await screen.findByText('PNG, JPG, WebP 이미지를 5MB 이하로 선택해 주세요.');
    const large = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', {
      type: 'image/png',
    });
    fireEvent.change(screen.getByLabelText('프로필 이미지 선택'), { target: { files: [large] } });
    expect(useProfilePreviewStore.getState().profile.image).toBe('');
  });
});
