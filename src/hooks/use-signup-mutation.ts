import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";

export function useSignupMutation() {

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
      
      // 로그인 페이지 연결 후 주석 해제
    },
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}