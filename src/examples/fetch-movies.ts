import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";


getMoviesWithFetch(1)
  .then((response) => console.log("영화 요청 성공", response.results))
  .catch((error) => console.error("영화 요청 실패", error));