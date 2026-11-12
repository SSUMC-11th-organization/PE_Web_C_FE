import { Link } from "@tanstack/react-router";

export function ProfilePage() {
  return <main className="profile-page">
    <header className="profile-heading"><h1>내 정보</h1><Link className="primary-link" to="/members/edit">정보 수정</Link></header>
    <section className="profile-summary" aria-labelledby="profile-basic-title">
      <h2 id="profile-basic-title">기본 정보</h2>
      <div className="profile-summary__row"><div className="profile-avatar"><img src="/icons/person.svg" alt="프로필" /></div>
        <dl><div><dt>닉네임</dt><dd>—</dd></div><div><dt>이메일</dt><dd>—</dd></div></dl>
      </div><p className="profile-note">로그인 기능이 연결되면 내 정보가 표시돼요.</p>
    </section>
    <section className="profile-ratings" aria-labelledby="profile-ratings-title"><h2 id="profile-ratings-title">내 평점보기</h2><div className="profile-empty"><img src="/icons/star.svg" alt="" /><p>로그인 후 내가 남긴 평점을 확인할 수 있어요.</p><Link to="/">영화 둘러보기</Link></div></section>
  </main>;
}
