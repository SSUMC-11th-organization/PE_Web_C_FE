import { useState, type SubmitEvent } from "react";

export function RatingForm() {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) { e.preventDefault(); setMessage("로그인과 평점 저장 기능이 연결되면 등록할 수 있어요."); }
  return <aside className="movie-rating"><h2>내 평점</h2><form onSubmit={handleSubmit}>
    <fieldset><legend>별점 선택</legend><div className="movie-rating__stars">{[1, 2, 3, 4, 5].map((value) => <label key={value} className={value <= score ? "is-selected" : ""}><input type="radio" name="rating" value={value} checked={score === value} onChange={() => setScore(value)} aria-label={`${value}점`} /><span aria-hidden="true">★</span></label>)}</div></fieldset>
    <label htmlFor="rating-comment">한줄평</label><textarea id="rating-comment" placeholder="이 영화는 어떠셨나요?" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} />
    <button type="submit" disabled={score === 0}>평점 등록</button>
    {message && <p role="status">{message}</p>}
  </form></aside>;
}