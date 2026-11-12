import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";


export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("로그인 API가 준비되면 이용할 수 있어요.");
  }
  return <main className="signup-page login-page"><form className="signup-form" onSubmit={handleSubmit}>
    <h1>로그인</h1>
    <div className="signup-field"><label htmlFor="login-email">이메일</label><div className="signup-input-row"><input id="login-email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div></div>
    <div className="signup-field"><label htmlFor="login-password">비밀번호</label><div className="signup-input-row"><input id="login-password" type="password" autoComplete="current-password" placeholder="비밀번호 입력" value={password} onChange={(e) => setPassword(e.target.value)} required /></div></div>
    <button className="signup-submit" type="submit">로그인</button>
    {message && <p className="signup-help" role="status">{message}</p>}
    <p className="signup-login">아직 계정이 없나요? <Link to="/signup">회원가입</Link></p>
  </form></main>;
}
