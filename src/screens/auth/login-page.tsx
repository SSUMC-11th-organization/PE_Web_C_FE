"use client";

import Link from "next/link";
import { useState } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="signup-page login-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>로그인</h1>

        <div className="signup-field">
          <label htmlFor="login-email">이메일</label>
          <div className="signup-input-row">
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="signup-field">
          <label htmlFor="login-password">비밀번호</label>
          <div className="signup-input-row">
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호 입력"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              required
            />
          </div>
        </div>

        <button
          className="signup-submit"
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="signup-login">
          아직 계정이 없나요? <Link href="/signup">회원가입</Link>
        </p>
      </form>
    </main>
  );
}