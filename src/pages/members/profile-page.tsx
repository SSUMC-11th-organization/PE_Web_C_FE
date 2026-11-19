import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useFavoritesQuery, useMeQuery, useRatingsQuery } from "../../hooks/use-member-queries";

function MovieLink({ movieId }: { movieId: number }) {
  const movie = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    staleTime: 30 * 1000,
    retry: false,
  });

  return (
    <Link to="/movies/$movieId" params={{ movieId: String(movieId) }}>
      {movie.data?.title ?? `영화 #${movieId}`}
    </Link>
  );
}

export function ProfilePage() {
  const me = useMeQuery();
  const favorites = useFavoritesQuery();
  const { memberId, query: ratings } = useRatingsQuery();

  return (
    <main className="profile-page">
      <header className="profile-heading">
        <h1>내 정보</h1>
        <Link className="primary-link" to="/members/edit">정보 수정</Link>
      </header>
      <section className="profile-summary" aria-labelledby="profile-basic-title">
        <h2 id="profile-basic-title">기본 정보</h2>
        {me.isPending && <p role="status">내 정보를 불러오는 중이에요.</p>}
        {me.isError && <p role="alert">내 정보를 불러오지 못했어요.</p>}
        {me.data && (
          <div className="profile-summary__row">
            <div className="profile-avatar"><img src="/icons/person.svg" alt="프로필" /></div>
            <dl>
              <div><dt>닉네임</dt><dd>{me.data.nickname}</dd></div>
              <div><dt>이메일</dt><dd>{me.data.email}</dd></div>
            </dl>
          </div>
        )}
      </section>

      <section className="profile-ratings" aria-labelledby="profile-favorites-title">
        <h2 id="profile-favorites-title">내 즐겨찾기</h2>
        {favorites.isPending && <p role="status">즐겨찾기를 불러오는 중이에요.</p>}
        {favorites.isError && <p role="alert">즐겨찾기를 불러오지 못했어요.</p>}
        {favorites.data?.length === 0 && (
          <div className="profile-empty">
            <p>즐겨찾기한 영화가 아직 없어요.</p>
            <Link to="/">영화 둘러보기</Link>
          </div>
        )}
        {favorites.data && favorites.data.length > 0 && (
          <ul className="space-y-3">
            {favorites.data.map(({ favoriteId, movieId }) => (
              <li key={favoriteId}><MovieLink movieId={movieId} /></li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile-ratings" aria-labelledby="profile-ratings-title">
        <h2 id="profile-ratings-title">내 평점보기</h2>
        {memberId === null && <p role="alert">회원 번호를 확인할 수 없어요.</p>}
        {memberId !== null && ratings.isPending && <p role="status">평점을 불러오는 중이에요.</p>}
        {ratings.isError && <p role="alert">평점을 불러오지 못했어요.</p>}
        {ratings.data?.length === 0 && (
          <div className="profile-empty">
            <p>남긴 평점이 아직 없어요.</p>
            <Link to="/">영화 둘러보기</Link>
          </div>
        )}
        {ratings.data && ratings.data.length > 0 && (
          <ul className="space-y-3">
            {ratings.data.map(({ ratingId, movieId, score, comment }) => (
              <li key={ratingId}>
                <MovieLink movieId={movieId} /> · {score}/5
                {comment && <p>{comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
