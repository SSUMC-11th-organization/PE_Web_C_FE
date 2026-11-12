import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";

export function ProfileEditPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) { e.preventDefault(); setMessage("내 정보 수정 API가 준비되면 저장할 수 있어요."); }
  return <main className="profile-page profile-edit">
    <form onSubmit={handleSubmit}>
      <header className="profile-heading"><div><h1>내 정보 수정</h1><p>닉네임과 프로필 정보를 수정할 수 있어요.</p></div><button className="primary-link" type="submit">변경사항 저장</button></header>
      <div className="profile-edit__layout"><div className="profile-edit__avatar"><div className="profile-avatar"><img src="/icons/person.svg" alt="프로필" /></div><strong>프로필 이미지</strong><span>이미지 변경 준비 중</span></div>
        <div className="profile-edit__fields"><div className="signup-field"><label htmlFor="edit-nickname">닉네임</label><div className="signup-input-row"><input id="edit-nickname" placeholder="2–12자" minLength={2} maxLength={12} required value={nickname} onChange={(e) => setNickname(e.target.value)} /><button className="signup-check" type="button" disabled title="회원 정보 API 연결 후 사용할 수 있어요">중복 확인</button></div></div>
        <div className="signup-field"><label htmlFor="edit-email">이메일</label><div className="signup-input-row"><input id="edit-email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} /></div></div>
        <p className="profile-note">회원 정보 조회·수정 기능은 준비 중이에요.</p>{message && <p role="status" className="profile-note">{message}</p>}<Link className="profile-back" to="/members">내 정보로 돌아가기</Link></div>
      </div>
    </form>
    <section className="profile-danger"><div><h2>회원 탈퇴</h2><p>탈퇴하면 계정과 활동 정보를 복구할 수 없어요.</p></div><button type="button" disabled title="회원 탈퇴 기능 준비 중">회원 탈퇴</button></section>
  </main>;
}
