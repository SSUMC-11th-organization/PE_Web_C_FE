import { apiClient } from "../api-client";

// 서버에 보낼 데이터
export interface SignupRequest {
    email: string;
    nickname: string;
    password: string;
}

// 서버에서 받을 응답
export interface SignupResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
        memberId: number;
        email: string;
        nickname: string;
    } | null;
}

export function signup(body: SignupRequest) {
    return apiClient
        .post("members", { json: body })
        .json<SignupResponse>();
}