'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { FormField, FormPage, primaryButton } from '../../components/auth/form-ui';
import { AccountError } from '../../components/auth/request-error';
import { useLoginMutation } from '../../hooks/use-login-mutation';
import { isEmailValid } from '../../utils/auth/validation';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const locked = useRef(false);
  const mutation = useLoginMutation();
  return (
    <FormPage title="로그인" description="다시 만나 반가워요. 좋아하는 영화를 이어서 만나보세요.">
      <form
        className="space-y-6"
        noValidate
        aria-busy={mutation.isPending}
        onSubmit={(event) => {
          event.preventDefault();
          if (!isEmailValid(email) || !password || mutation.isPending || locked.current) return;
          locked.current = true;
          mutation.mutate(
            { email, password },
            {
              onSettled: () => {
                locked.current = false;
              },
            },
          );
        }}
      >
        <FormField
          id="login-email"
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력해주세요"
          disabled={mutation.isPending}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            mutation.reset();
          }}
          error={
            email && !isEmailValid(email) ? '올바른 이메일 형식으로 입력해 주세요.' : undefined
          }
        />
        <FormField
          id="login-password"
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력해주세요"
          disabled={mutation.isPending}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            mutation.reset();
          }}
        />
        {mutation.isError && <AccountError error={mutation.error} />}
        <button
          type="submit"
          className={`${primaryButton} w-full`}
          disabled={!isEmailValid(email) || !password || mutation.isPending}
        >
          {mutation.isPending ? '로그인 중' : '로그인'}
        </button>
        <p className="text-center text-sm text-muted">
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="ml-2 font-bold text-primary">
            회원가입
          </Link>
        </p>
      </form>
    </FormPage>
  );
}
