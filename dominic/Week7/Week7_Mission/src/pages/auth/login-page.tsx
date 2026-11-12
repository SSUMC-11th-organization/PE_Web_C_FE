import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { FormField, FormPage, primaryButton } from '../../components/auth/form-ui';
import { isEmailValid } from '../../utils/auth/validation';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  return (
    <FormPage title="로그인" description="다시 만나 반가워요. 좋아하는 영화를 이어서 만나보세요.">
      <form
        className="space-y-6"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (isEmailValid(email) && password)
            setMessage('로그인 기능은 준비 중이에요. 지금은 화면만 체험할 수 있어요.');
        }}
      >
        <FormField
          id="login-email"
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setMessage('');
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
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setMessage('');
          }}
        />
        {message && (
          <p role="status" className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            {message}
          </p>
        )}
        <button
          type="submit"
          className={`${primaryButton} w-full`}
          disabled={!isEmailValid(email) || !password}
        >
          로그인
        </button>
        <p className="text-center text-sm text-muted">
          아직 계정이 없으신가요?{' '}
          <Link to="/signup" className="ml-2 font-bold text-primary">
            회원가입
          </Link>
        </p>
      </form>
    </FormPage>
  );
}
