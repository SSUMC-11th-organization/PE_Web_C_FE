// 4.2 Network 패널 확인용 임시 파일입니다.
// 확인이 끝나면 src/main.tsx의 임시 import를 삭제하세요.
import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch(1)
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));
