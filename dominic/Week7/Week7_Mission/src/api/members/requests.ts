import { HTTPError } from 'ky';
import { apiClient } from '../api-client';

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}
export interface SignupResponse {
  message: string;
  result: { memberId: number; email: string; nickname: string };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
function unwrap(value: unknown): unknown {
  if (isRecord(value) && value.isSuccess === false) {
    throw new Error(typeof value.message === 'string' ? value.message : '요청에 실패했어요.');
  }
  return isRecord(value) && 'result' in value ? value.result : value;
}
async function checkDuplicate(field: 'email' | 'nickname', value: string) {
  const body: unknown = await apiClient
    .get(`members/${field}/${encodeURIComponent(value.trim())}`)
    .json();
  // 워크북의 { available }와 로컬 회원 서버의 { result: { available } }를 처리해요.
  const result = unwrap(body);
  if (!isRecord(result) || typeof result.available !== 'boolean') {
    throw new Error('중복 확인 응답 형식을 확인해 주세요.');
  }
  return result.available;
}
export const checkEmailDuplicate = (email: string) => checkDuplicate('email', email);
export const checkNicknameDuplicate = (nickname: string) => checkDuplicate('nickname', nickname);

export async function signup(body: SignupRequest): Promise<SignupResponse> {
  // 전달받은 객체에 다른 필드가 있어도 passwordConfirm은 서버에 보내지 않아요.
  const response: unknown = await apiClient
    .post('members', {
      json: { email: body.email.trim(), nickname: body.nickname.trim(), password: body.password },
    })
    .json();
  const result = unwrap(response);
  if (
    !isRecord(response) ||
    response.isSuccess !== true ||
    typeof response.message !== 'string' ||
    !isRecord(result) ||
    !Number.isSafeInteger(result.memberId) ||
    typeof result.email !== 'string' ||
    typeof result.nickname !== 'string'
  ) {
    throw new Error('회원가입 응답 형식을 확인해 주세요.');
  }
  return {
    message: response.message,
    result: {
      memberId: Number(result.memberId),
      email: result.email,
      nickname: result.nickname,
    },
  };
}

export async function memberErrorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    const body: unknown = error.data;
    if (isRecord(body) && typeof body.message === 'string') return body.message;
    return `요청에 실패했어요. (HTTP ${error.response.status}) 다시 시도해 주세요.`;
  }
  if (error instanceof TypeError || (error instanceof Error && error.name === 'TimeoutError')) {
    return '회원 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.';
  }
  return error instanceof Error ? error.message : '요청에 실패했어요. 다시 시도해 주세요.';
}
