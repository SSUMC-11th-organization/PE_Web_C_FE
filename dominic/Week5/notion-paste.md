# 5주차 · Notion 붙여 넣기용

아래 내용을 워크북의 해당 항목에 나누어 붙여 넣으면 됩니다. 아직 수행하지 않은 검증은 대기로 표시했습니다.

워크북: [5주차 API 요청 및 서버 데이터 연동](https://makeus-challenge.notion.site/5-API-ec5b57f4596b834da7a481b209c1915f)
GitHub 이슈: [#38](https://github.com/SSUMC-11th-organization/PE_Web_C_FE/issues/38)
GitHub PR: [#39 · Dominic 5주차 API 요청 및 서버 데이터 연동](https://github.com/SSUMC-11th-organization/PE_Web_C_FE/pull/39)
제출 브랜치: `dominic/#38` → `dominic/main`

## 핵심 키워드

### HTTP와 API

#### 1. API·endpoint·HTTP method·status code의 역할

API는 프로그램끼리 데이터를 주고받는 약속이고, endpoint는 요청을 보낼 주소입니다.
method는 조회·생성 같은 작업을, status code는 처리 결과를 나타냅니다.
예를 들어 `GET /movie/popular?page=2`는 인기 영화 2페이지 조회이며, `200`은 성공, `401`은 인증 정보 문제입니다. [TMDB 목록 API](https://developer.themoviedb.org/reference/movie-popular-list)

#### 2. origin이 다를 때 CORS의 역할

origin은 프로토콜·호스트·포트의 조합입니다. CORS는 브라우저가 다른 origin의 응답을 JavaScript에 제공해도 되는지 서버의 응답 header로 확인하는 규칙입니다.
이번 앱도 로컬 주소에서 TMDB로 요청하므로 적용됩니다. 오류가 나면 URL·인증·서버 허용 설정을 구분해 확인하고, 브라우저 보안을 끄거나 `no-cors`로 해결하려 하지 않습니다. [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

### Promise와 비동기 처리

#### 3. pending·fulfilled·rejected의 의미

Promise는 비동기 작업의 결과를 나중에 전달하는 객체입니다.
`pending`은 결과를 기다리는 중, `fulfilled`는 성공하여 값이 생긴 상태, `rejected`는 실패 이유가 생긴 상태입니다. 결과가 정해진 Promise는 다시 pending으로 돌아가지 않으며, 재시도는 새로운 요청을 만드는 것입니다. [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#### 4. .then().catch()와 async/await의 차이

둘 다 Promise를 다루지만 `.then().catch()`는 콜백을 연결하고, `async/await`는 위에서 아래로 읽는 형태로 표현합니다.
오류는 각각 `.catch()`와 `try/catch`로 처리하고, 공통 마무리는 `.finally()` 또는 `finally`에 둡니다. `async` 함수의 반환값도 Promise입니다.

```ts
getMovies({ page: 1 }).then(showMovies).catch(showError);

async function loadMovies() {
  try { showMovies(await getMovies({ page: 1 })); }
  catch (error) { showError(error); }
}
// showMovies/showError는 흐름 설명용 함수입니다.
```

#### 5. await가 브라우저 전체를 멈추지 않는 이유

`await`는 현재 async 함수의 다음 실행을 미룰 뿐 JavaScript 메인 스레드를 붙잡고 기다리지 않습니다.
브라우저가 네트워크 작업을 진행하는 동안 입력이나 다른 코드를 처리할 수 있고, Promise가 정해지면 후속 작업이 이어집니다. 단, 메인 스레드에서 긴 동기 계산을 실행하면 화면은 여전히 멈출 수 있습니다. [MDN await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

### fetch와 HTTP 요청 라이브러리

#### 6. 네트워크 오류와 HTTP 오류를 구분하는 이유

`fetch`는 네트워크 실패나 요청 취소 등에는 reject하지만, 서버가 `404`·`500` 응답을 보내는 것만으로는 reject하지 않습니다.
따라서 `response.ok`를 확인해 HTTP 오류를 던진 뒤 JSON을 읽어야 합니다. 이번 실습은 이 처리를 `getMoviesWithFetch`에 넣었습니다. [MDN Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

#### 7. 여러 API에서 반복되는 설정과 처리

base URL, Bearer 인증 header, 한국어·페이지 query, JSON 파싱, 오류 처리가 반복됩니다.
이번 구현은 `tmdb-client.ts`에 공통 설정을 모으고, 목록·검색·상세 endpoint 함수는 각각 분리했습니다. 자동 재시도는 `retry: 0`으로 끄고 화면의 버튼으로 같은 요청을 다시 실행합니다.

#### 8. ky와 Axios의 JSON·공통 처리 방식

ky는 Fetch API 기반이며 `.json<T>()`의 결과로 JSON body를 읽고, 인스턴스와 hooks로 공통 처리를 구성합니다.
Axios는 응답의 `response.data`를 읽고 인스턴스와 interceptors를 사용합니다. 둘 다 기본적으로 성공 범위 밖 HTTP status를 오류로 처리하지만, 타입 표기만으로 실제 JSON 구조를 검사해 주는 것은 아닙니다. [ky](https://github.com/sindresorhus/ky), [Axios 응답](https://axios-http.com/docs/res_schema), [Axios interceptors](https://axios-http.com/docs/interceptors)

### 비동기 데이터의 UI 상태

#### 9. 로딩·오류·빈 결과·성공을 구분하는 이유

데이터가 없다는 사실만으로는 아직 기다리는 중인지, 실패했는지, 검색 결과가 정말 없는지 알 수 없습니다.
이번 앱은 요청 상태를 로딩·오류·성공으로 구분하고, 성공 응답의 `results.length === 0`을 빈 결과로 표시합니다. 빈 검색어는 요청 전 안내로 별도 처리합니다.

#### 10. 각 상태에 필요한 정보와 동작

로딩에는 진행 안내, 오류에는 이해할 수 있는 원인과 재시도 버튼, 빈 결과에는 다른 검색어를 시도할 안내, 성공에는 영화 정보를 보여줍니다.
재시도는 마지막 요청의 검색어·페이지·ID를 유지합니다. 화면을 떠나면 AbortController로 취소하고, 늦게 도착한 이전 결과가 새 화면을 덮어쓰지 않게 정리합니다. [React Effect의 데이터 요청](https://react.dev/reference/react/useEffect#fetching-data-with-effects)

#### 11. API 응답 타입과 UI 타입을 나누는 장점

API 타입은 서버 JSON의 `poster_path`, `genre_ids` 등을 그대로 표현하고, UI 타입은 카드에서 바로 쓸 이미지 URL과 표시용 이름을 표현합니다.
adapter가 `snake_case → camelCase`, 이미지 URL, 장르명, 상영 시간 같은 변환을 맡으면 서버 구조가 바뀌어도 컴포넌트의 수정 범위가 줄어듭니다.
이번 앱은 `toMovie`·`toMovieDetail`을 사용하며, null 이미지는 대체 영역으로, 북마크는 서버 응답이 아닌 Zustand의 실제 영화 ID로 처리합니다.

### 꼭 기억할 주의사항

- `.json<T>()`는 런타임 검증이 아닙니다. 이번 구현은 `parseMovieList`·`parseMovieDetail`로 실제 데이터의 형태도 확인합니다.
- `.env.local`은 Git에 올리지 않습니다. 그러나 `VITE_` 변수는 브라우저 빌드에 포함되므로 비밀 보관 수단은 아닙니다. [Vite 환경 변수](https://vite.dev/guide/env-and-mode)
- API 응답은 서버 데이터이고 북마크는 클라이언트 상태입니다. 이번 주는 Effect로 요청하며 TanStack Query의 캐시 관리는 다음 주차 범위입니다.


## 필수 미션 기록

기존 영화 더미 데이터를 TMDB API로 교체했다. 순수 fetch로 인기 영화를 요청하고, `response.ok`를 검사한 뒤 JSON을 읽도록 했다. 이후 ky 공통 인스턴스로 인증 header와 base URL을 분리하고 목록·검색·상세 API 함수를 각각 작성했다.

화면은 로딩·오류·빈 결과·성공을 구분했다. 빈 검색어와 잘못된 영화 ID는 요청하지 않고, 상세 404는 ‘영화를 찾을 수 없어요’로 안내한다. 이미지 경로는 TMDB 이미지 URL로 변환하고, 이미지가 없거나 로딩에 실패하면 같은 크기의 대체 영역을 표시한다. TMDB 로고와 출처 문구도 유지했다.

기존 Zustand 북마크는 실제 TMDB 영화 ID로 연결했다. 저장 버전을 구분해 4주차 더미 ID가 실제 영화의 북마크로 잘못 복원되지 않도록 했다.

### 확인 결과

- 실제 인기 영화 1·2페이지, 검색과 상세에서 HTTP 200 응답 확인
- 순수 fetch 실습 버튼으로 실제 영화 20편 수신
- 목록·검색 2페이지 이동, 새로고침·뒤로가기 후 URL과 결과 복원 확인
- 인셉션 상세의 제목·장르·2시간 28분·포스터·배경 확인
- 북마크 공유·새로고침 복원·해제 확인
- 존재하지 않는 영화의 404 안내와 같은 ID의 재시도 확인
- 자동 테스트 9개 파일·141개 통과, 전체 Biome·ESLint·타입 검사·빌드 통과
- 정상 목록·검색·상세 흐름에서 Console warn/error 없음
- **대기:** 개발자 도구 Network 패널 직접 확인, offline→online 수동 재시도. Safari 사용 종료 후 검증 예정

자동 테스트·HTTP 클라이언트 확인과 실제 개발자 도구 조작을 구분해 기록했다. 토큰은 `.env.local`에만 보관하고 Git에는 올리지 않았다.

## 선택 미션 기록

1. **재시도 버튼:** 실패한 요청의 검색어·페이지·영화 ID를 유지해 새 요청을 실행한다. ky의 자동 재시도는 꺼 두어 수동 재시도와 구분했다.
2. **페이지네이션:** 목록·검색의 URL `page`를 API query와 연결했다. 응답의 전체 페이지 수를 반영하고 새 검색은 1페이지부터 시작한다.
3. **응답 adapter:** `toMovie`와 `toMovieDetail`로 필드명·이미지 URL·장르·상영 시간을 UI용 모델로 변환해 컴포넌트의 서버 응답 의존도를 줄였다.

## 트러블슈팅

### 1. 토큰을 넣었는데 미설정 안내가 계속 표시됨

- **이슈:** API 토큰을 입력했지만 영화가 표시되지 않았다.
- **원인:** Vite가 읽지 않는 `.env.example`에 실제 토큰을 입력했다.
- **해결:** 실제 설정을 `.env.local`로 옮기고 예제 파일은 안내 문구로 복구했다. Git 제외와 서버 재시작을 확인한 뒤 실제 API 응답으로 동작을 검증했다.
- **배운 점:** 설정 예제와 로컬 설정을 구분해야 하며, `VITE_` 변수는 브라우저에 포함되므로 비밀 보관 수단은 아니다.

### 2. 기존 북마크 검증이 실제 영화 ID를 거부할 수 있었음

- **이슈:** 고정 더미 목록을 기준으로 검사하면 TMDB에서 받은 새 ID를 북마크할 수 없는 구조였다.
- **원인:** ID 형식 검사와 더미 데이터의 존재 여부 검사를 섞어서 사용했다.
- **해결:** 양의 안전한 정수 ID를 검사하고 실제 TMDB ID의 추가·복원 테스트를 작성했다. 저장 버전도 올려 더미 ID의 잘못된 복원을 방지했다.
- **배운 점:** 데이터 출처가 바뀌면 식별자의 의미와 저장 데이터 호환성도 함께 확인해야 한다.

### 3. TypeScript 생성자 문법 오류

- **이슈:** `TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`
- **원인:** 생성자 parameter property 축약 문법이 프로젝트 설정에 맞지 않았다.
- **해결:** 클래스 필드를 따로 선언하고 생성자에서 대입했다.
- **배운 점:** 예제를 적용할 때는 라이브러리뿐 아니라 컴파일 옵션도 확인해야 한다.

## 학습 내용 요약

API 함수는 서버와 통신하고, adapter는 응답을 화면에 맞게 변환하며, 컴포넌트는 요청 상태에 따라 UI를 보여 준다. 타입 선언만으로 실제 응답이 검증되지는 않으므로 JSON 경계 검증도 필요하다. 늦게 도착한 이전 응답이 새 검색 결과를 덮어쓰지 않도록 요청 정리와 취소를 함께 처리했다.

## 제출 전 확인

- [x] 핵심 키워드·필수/선택 미션·트러블슈팅 작성
- [x] 실제 API 정상 응답 및 주요 화면 검증
- [x] 전체 자동 검사 통과
- [x] 이슈·브랜치·커밋·푸시·PR 생성 및 팀원 리뷰 요청
- [ ] Network 패널 및 offline→online 수동 검증
- [ ] 본인이 내용을 읽고 이해한 부분·궁금한 점 보완
- [ ] Notion에 붙여 넣기 및 피드백 시스템에 URL 제출
