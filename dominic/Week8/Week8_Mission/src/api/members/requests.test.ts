import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
  memberErrorMessage,
  signup,
} from './requests';

const fetchMock = vi.fn<typeof fetch>();
const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('회원 서버 요청 계약', () => {
  it('중복 확인의 직접 응답과 result 래핑 응답을 모두 처리한다', async () => {
    fetchMock
      .mockResolvedValueOnce(json({ available: true }))
      .mockResolvedValueOnce(json({ isSuccess: true, result: { available: false } }));
    expect(await checkEmailDuplicate(' a+b@example.com ')).toBe(true);
    expect(await checkNicknameDuplicate('한글 & 닉네임')).toBe(false);
    const emailRequest = fetchMock.mock.calls[0]?.[0] as Request;
    const nicknameRequest = fetchMock.mock.calls[1]?.[0] as Request;
    expect(new URL(emailRequest.url).pathname).toBe('/members/email/a%2Bb%40example.com');
    expect(decodeURIComponent(new URL(nicknameRequest.url).pathname)).toBe(
      '/members/nickname/한글 & 닉네임',
    );
    expect(emailRequest.headers.has('Authorization')).toBe(false);
  });
  it('형식이 잘못됐거나 논리적으로 실패한 응답은 사용 가능으로 오인하지 않는다', async () => {
    fetchMock
      .mockResolvedValueOnce(json({ available: 'true' }))
      .mockResolvedValueOnce(json({ isSuccess: false, message: '실패' }));
    await expect(checkEmailDuplicate('a@example.com')).rejects.toThrow('형식');
    await expect(checkNicknameDuplicate('도미닉')).rejects.toThrow('실패');
  });
  it('회원가입에 세 필드만 전송하고 성공 데이터를 반환한다', async () => {
    let sentBody: unknown;
    fetchMock.mockImplementationOnce(async (input) => {
      sentBody = await (input as Request).clone().json();
      return json(
        {
          isSuccess: true,
          message: '가입 성공',
          result: { memberId: 1, email: 'a@example.com', nickname: '도미닉' },
        },
        201,
      );
    });
    const input = {
      email: ' a@example.com ',
      nickname: ' 도미닉 ',
      password: 'Test1234!',
      passwordConfirm: 'Test1234!',
    };
    expect((await signup(input)).result.memberId).toBe(1);
    const request = fetchMock.mock.calls[0]?.[0] as Request;
    expect(request.method).toBe('POST');
    expect(sentBody).toEqual({
      email: 'a@example.com',
      nickname: '도미닉',
      password: 'Test1234!',
    });
    expect(request.headers.has('Authorization')).toBe(false);
  });
  it('409를 자동 재시도하지 않고 서버 안내를 반환한다', async () => {
    fetchMock.mockResolvedValueOnce(
      json({ isSuccess: false, message: '이미 사용 중인 이메일입니다.' }, 409),
    );
    try {
      await signup({ email: 'a@example.com', nickname: '도미닉', password: 'Test1234!' });
      expect.fail('실패해야 해요');
    } catch (error) {
      expect(await memberErrorMessage(error)).toBe('이미 사용 중인 이메일입니다.');
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('HTTP 200이어도 isSuccess false이면 가입 완료로 표시하지 않는다', async () => {
    fetchMock.mockResolvedValueOnce(json({ isSuccess: false, message: '가입 실패', result: null }));
    await expect(
      signup({ email: 'a@example.com', nickname: '도미닉', password: 'Test1234!' }),
    ).rejects.toThrow('가입 실패');
  });
});
