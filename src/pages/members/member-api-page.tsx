import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  checkNickname,
  checkEmail,
  getMemberRatings,
  type RatingResponse,
} from "../../api/members/member-api";

export function MemberApiPage() {
  const [nickname, setNickname] = useState("");
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");

  const [email, setEmail] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<RatingResponse[]>([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [ratingsError, setRatingsError] = useState("");
  const [hasLoadedRatings, setHasLoadedRatings] = useState(false);

  async function handleCheckNickname() {
    const value = nickname.trim();

    if (!value) {
      setNicknameMessage("닉네임을 입력해 주세요.");
      return;
    }

    setIsCheckingNickname(true);
    setNicknameMessage("");

    try {
      const response = await checkNickname(value);

      setNicknameMessage(
        response.available
          ? `‘${value}’은 사용할 수 있는 닉네임이에요.`
          : `‘${value}’은 이미 사용 중인 닉네임이에요.`,
      );
    } catch (error) {
      setNicknameMessage(
        error instanceof Error
          ? error.message
          : "닉네임 확인에 실패했어요.",
      );
    } finally {
      setIsCheckingNickname(false);
    }
  }

  async function handleCheckEmail() {
    const value = email.trim();

    if (!value) {
        setEmailMessage("이메일을 입력해 주세요.");
        return;
    }

    setIsCheckingEmail(true);
    setEmailMessage("");

    try {
        const response = await checkEmail(value);

        setEmailMessage(
        response.available
            ? `‘${value}’은 사용할 수 있는 이메일이에요.`
            : `‘${value}’은 이미 사용 중인 이메일이에요.`,
        );
    } catch (error) {
        setEmailMessage(
        error instanceof Error
            ? error.message
            : "이메일 확인에 실패했어요.",
        );
    } finally {
        setIsCheckingEmail(false);
    }
    }

    async function handleLoadRatings() {
        const parsedMemberId = Number(memberId);

        setRatings([]);
        setRatingsError("");
        setHasLoadedRatings(false);

        if (!Number.isInteger(parsedMemberId) || parsedMemberId <= 0) {
            setRatingsError("회원 ID는 양의 정수로 입력해 주세요.");
            return;
        }

        setIsLoadingRatings(true);

        try {
            const response = await getMemberRatings(parsedMemberId);

            setRatings(response);
            setHasLoadedRatings(true);
        } catch (error) {
            setRatingsError(
            error instanceof Error
                ? error.message
                : "평점 조회에 실패했어요.",
            );
        } finally {
            setIsLoadingRatings(false);
        }
    }

  return (
    <main className="member-page">
      <header className="member-page__heading">
        <span className="member-page__eyebrow">MY UMCINE</span>
        <h1>내 정보</h1>
        <p>사용할 닉네임과 이메일을 확인하고, 영화에 남긴 평점을 찾아보세요.</p>
      </header>

      <div className="member-page__intro">
        <div className="member-page__avatar"><img src="/icons/person.svg" alt="" /></div>
        <div><h2>나의 영화 취향을 기록하는 공간</h2><p>좋아하는 영화와 나만의 감상을 차곡차곡 모아보세요.</p></div>
        <Link to="/">영화 둘러보기 <img src="/icons/arrow-right.svg" alt="" /></Link>
      </div>

      <div className="member-page__grid">
        <section className="member-card" aria-labelledby="nickname-title">
          <div className="member-card__heading">
            <span className="member-card__icon"><img src="/icons/edit.svg" alt="" /></span>
            <div><h2 id="nickname-title">닉네임 확인</h2><p>사용하고 싶은 닉네임이 있나요?</p></div>
          </div>
          <label htmlFor="nickname">닉네임</label>
          <div className="member-card__input-row">
            <input id="nickname" placeholder="닉네임을 입력해 주세요" value={nickname}
              onChange={(event) => setNickname(event.target.value)} disabled={isCheckingNickname}
              aria-describedby="nickname-message" />
            <button type="button" onClick={handleCheckNickname} disabled={isCheckingNickname}>
              {isCheckingNickname ? "확인 중…" : "중복 확인"}
            </button>
          </div>
          <p id="nickname-message" className="member-card__message" role="status">{nicknameMessage}</p>
        </section>

        <section className="member-card" aria-labelledby="email-title">
          <div className="member-card__heading">
            <span className="member-card__icon"><img src="/icons/mail.svg" alt="" /></span>
            <div><h2 id="email-title">이메일 확인</h2><p>이메일의 사용 가능 여부를 확인하세요.</p></div>
          </div>
          <label htmlFor="email">이메일 주소</label>
          <div className="member-card__input-row">
            <input id="email" type="email" placeholder="example@email.com" value={email}
              onChange={(event) => setEmail(event.target.value)} disabled={isCheckingEmail}
              aria-describedby="email-message" />
            <button type="button" onClick={handleCheckEmail} disabled={isCheckingEmail}>
              {isCheckingEmail ? "확인 중…" : "중복 확인"}
            </button>
          </div>
          <p id="email-message" className="member-card__message" role="status">{emailMessage}</p>
        </section>

        <section className="member-card member-card--ratings" aria-labelledby="ratings-title">
          <div className="member-card__heading">
            <span className="member-card__icon member-card__icon--gold"><img src="/icons/star-outline.svg" alt="" /></span>
            <div><h2 id="ratings-title">영화 평점 모아보기</h2><p>회원 ID로 등록된 별점과 감상을 확인하세요.</p></div>
          </div>
          <div className="member-card__lookup">
            <label htmlFor="member-id">회원 ID</label>
            <div className="member-card__input-row">
              <input id="member-id" type="number" min="1" step="1" value={memberId}
                onChange={(event) => setMemberId(event.target.value)} disabled={isLoadingRatings} />
              <button type="button" onClick={handleLoadRatings} disabled={isLoadingRatings}>
                {isLoadingRatings ? "조회 중…" : "평점 조회"}
              </button>
            </div>
          </div>

          <div className="member-ratings" aria-busy={isLoadingRatings}>
            {isLoadingRatings ? (
              <div className="member-empty" role="status"><span className="detail-state__loader" /><p>평점을 불러오는 중이에요.</p></div>
            ) : ratingsError ? (
              <div className="member-empty member-empty--error" role="alert"><p>{ratingsError}</p><span>회원 ID를 확인하고 다시 조회해 주세요.</span></div>
            ) : hasLoadedRatings ? (
              ratings.length === 0 ? (
                <div className="member-empty"><img src="/icons/star-outline.svg" alt="" /><h3>아직 등록한 평점이 없어요</h3><p>다른 회원 ID로도 조회할 수 있어요.</p></div>
              ) : (
                <>
                  <p className="member-ratings__count">등록한 평점 <strong>{ratings.length}</strong></p>
                  <ul className="member-ratings__list">
                    {ratings.map((rating) => (
                      <li key={rating.ratingId} className="member-rating">
                        <div className="member-rating__top">
                          <Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }}>영화 #{rating.movieId} <span>↗</span></Link>
                          <span className="member-rating__score"><img src="/icons/star.svg" alt="별점" />{rating.score}<small>/ 5</small></span>
                        </div>
                        <p className="member-rating__comment">{rating.comment || "남긴 코멘트가 없어요."}</p>
                        <dl className="member-rating__meta">
                          <div><dt>평점 ID</dt><dd>{rating.ratingId}</dd></div>
                          <div><dt>작성일</dt><dd>{rating.createdAt}</dd></div>
                          <div><dt>수정일</dt><dd>{rating.updatedAt}</dd></div>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </>
              )
            ) : (
              <div className="member-empty"><img src="/icons/movie.svg" alt="" /><h3>어떤 영화에 마음을 남겼나요?</h3><p>회원 ID를 입력하고 평점을 조회해 보세요.</p></div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
