# 5주차 미션 기록

기준: [API 요청 및 서버 데이터 연동 워크북](https://makeus-challenge.notion.site/5-API-ec5b57f4596b834da7a481b209c1915f)

## 필수 미션

### 수행 내용

4주차 UMCine의 화면·아이콘을 별도 5주차 프로젝트로 가져오고, 고정 영화 배열 대신 TMDB API를 사용하도록 변경했다. 이전 주차 파일은 수정하지 않았다.

- 순수 `fetch` 함수에서 인증 header와 한국어·page query를 보내고, `response.ok`를 검사한 뒤 JSON을 읽도록 했다.
- 목록의 ‘학습용 · 순수 fetch 요청 확인’은 버튼을 눌렀을 때만 실행되므로 Network 패널에서 ky 요청과 비교할 수 있다.
- ky 2.x 공통 인스턴스와 목록·검색·상세 요청 함수를 분리했다.
- 서버 응답 모델을 별도로 작성하고 실제 JSON 형태도 검사했다.
- 로딩·오류·빈 결과·성공, 빈 검색어, 잘못된 상세 ID, 상세 404를 구분했다.
- 이미지 경로를 TMDB URL로 바꾸고, null 이미지와 이미지 로드 실패를 회색 ‘이미지 없음’ 영역으로 처리했다.
- TMDB 로고와 출처 문구를 유지했다. 북마크는 응답에 넣지 않고 실제 영화 ID로 Zustand에서 조회했다.

### 핵심 코드

```ts
const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal });
if (!response.ok) throw new FetchHttpError(response.status);
const json: unknown = await response.json();
return parseMovieList(json);
```

```ts
return getTmdbClient()
  .get('movie/popular', { searchParams: { language: 'ko-KR', page }, signal })
  .json<GetMoviesResponse>()
  .then(parseMovieList);
```

위 코드는 설명용 발췌이며 실제 함수는 `src/api/movies/`에 있다. 요청 URL·토큰 자체는 로그로 출력하지 않는다.

## 선택 미션

### 1. 마지막 실패 요청 다시 시도

`useMovieRequest`에서 현재 요청 함수를 유지하고, 버튼을 누르면 상태를 로딩으로 바꾼 뒤 새 요청을 실행한다. 검색어·페이지·영화 ID는 바뀌지 않는다. ky의 자동 재시도는 0으로 설정해 버튼 동작과 구분했다.

### 2. URL 기반 페이지네이션

목록과 검색의 `page` search param을 TMDB의 `page` query로 연결했다. 페이지 버튼은 응답의 `total_pages`와 최대 요청 범위를 반영한다. 검색어를 새로 제출하면 1페이지로 이동하며, 검색 페이지 이동 시에는 기존 검색어를 유지한다.

직접 접근·새로고침에 필요한 값은 URL에 두고, 검색어·페이지·영화 ID별로 요청 컴포넌트를 구분했다. 이전 요청은 cleanup에서 취소하고 늦게 도착한 응답도 무시한다.

### 3. API 응답 → UI adapter

`toMovie`는 필드명과 이미지 URL을 변환하고, `toMovieDetail`은 장르명·상영 시간·소개 문구까지 변환한다. 서버 응답 타입과 UI 타입을 분리해 카드가 TMDB의 JSON 구조에 직접 의존하지 않도록 했다.

## 검증 결과

| 항목 | 결과·근거 |
| --- | --- |
| 핵심 키워드 | 워크북의 질문 11개를 `../core-keywords.md`에 미션 예시와 함께 작성 |
| 코드 품질 | 전체 Biome 68개 파일, ESLint·TypeScript 검사 통과 |
| 자동 테스트 | 9개 파일, 141개 통과. 실제 TMDB가 아닌 모의 응답 사용 |
| API 함수 | URL·query·인증 header, HTTP/네트워크 오류, 취소, 잘못된 JSON 검증 |
| 화면 통합 | jsdom·메모리 라우터로 세 화면, URL 페이지 복원, 검색 초기화, 세 화면 재시도·북마크 공유, 이미지 대체 확인 |
| 요청 경쟁 | 이전 응답이 늦게 도착해도 새 결과를 덮어쓰지 않는 테스트 통과 |
| 실제 브라우저 | 실제 목록·검색·상세, 목록/검색 2페이지, 새로고침·뒤로가기, 빈 결과, 검색→상세 북마크 공유·복원, 상세 404와 같은 ID 재시도 확인 |
| Console | 실제 정상 목록·검색·상세 흐름에서 warn/error 없음. 404는 별도 검증 탭에서 의도적으로 요청 |
| 빌드 | `pnpm build` 통과. 기존 router CLI의 `replaceRouteChunk` 경고는 남음 |
| 실제 TMDB 성공 응답 | 인기 영화 1·2페이지 각 20편, batman 검색 2페이지 20편, 인셉션 상세 148분을 HTTP 200으로 확인. 브라우저의 순수 fetch 버튼도 20편 수신 |
| Network 패널 직접 확인 | **대기**. 공식 API의 URL·query·status·JSON은 별도 HTTP 클라이언트로 확인했으나 패널 조작과는 구분. 사용자가 Safari 사용 중이므로 검증을 보류하도록 요청 |
| 실제 API로 3개 URL 직접 접근·새로고침 | 목록 `/?page=2`, 검색 `/search?query=batman&page=2`, 상세 `/movies/27205` 성공 화면과 새로고침 복원 확인 |

토큰 설정 후 실제 API 응답과 브라우저 동작을 추가로 검증했다. 자동 테스트와 실제 API 검증을 구분했다. Network 패널 및 offline→online 수동 검증은 Safari 사용이 끝날 때까지 보류하고, GitHub 제출을 먼저 준비해 달라는 사용자 요청에 따라 대기 상태로 남겼다.

검증용 북마크는 추가→상세 공유→새로고침 복원→해제 순서로 확인하고 원래 빈 상태로 되돌렸다. 실제 포스터와 배경 이미지는 각각 500px·1280px 원본이 로드된 것을 확인했다. 토큰 또는 Authorization header를 출력하거나 캡처하지 않았다.

### 동시 변경 메모

최종 확인 도중 이 작업에서 작성하지 않은 `src/components/movies/member-api-panel.tsx`와 목록의 패널 연결이 추가된 것을 확인했다. 해당 변경은 덮어쓰거나 삭제하지 않았다.
이후 버튼의 `type="submit"` 3곳과 포맷 수정이 이미 반영된 것을 확인했으며, 중복 수정 없이 검증했다. 최종 `pnpm fix`는 변경 없이 끝났고 전체 `pnpm check` 68개 파일, 빌드·ESLint·141개 테스트가 통과했다. 회원 API 기능 자체는 이번 TMDB 미션의 검증 결과에 포함하지 않는다.

실제 API 캡처: [상세](./docs/screenshots/movie-detail-live.png), [검색 2페이지](./docs/screenshots/movie-search-live.png), [404 안내](./docs/screenshots/movie-not-found-live.png).
이전 [토큰 미설정 안내](./docs/screenshots/token-setup-required.png)는 설정 전 상태를 기록한 참고 자료다.

## 트러블슈팅

### 1. TypeScript에서 생성자 parameter property가 거부됨

- 이슈: `error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`
- 원인: 생성자의 `public readonly status: number` 축약 문법이 현재 TypeScript 설정과 맞지 않았다.
- 해결: 클래스에 `readonly status: number`를 선언하고 생성자에서 `this.status = status`로 대입했다.
- 배운 점: TypeScript 문법이라도 프로젝트의 컴파일 옵션에 따라 사용 범위가 다르다.

### 2. 재시도 트리거를 불필요한 Effect 의존성으로 판단

- 이슈: `This hook specifies more dependencies than necessary: attempt.`
- 원인: `attempt`는 Effect 본문의 데이터가 아니라 같은 실패 요청을 재실행하기 위한 의도적인 의존성이었다.
- 해결: 이 한 곳에만 이유를 적은 Biome ignore 주석을 사용했다. 재시도 시 정확히 새 요청이 실행되는 테스트도 추가했다.
- 배운 점: 규칙을 전체 비활성화하지 않고, 필요한 예외는 좁게 적용하고 근거를 남긴다.

### 3. 기존 북마크 검증이 실제 영화 ID를 거부할 수 있음

- 이슈: 4주차의 고정 더미 영화 ID 목록으로 검증하면 TMDB에서 새로 받은 ID는 추가되지 않는 구조였다.
- 원인: 더미 데이터의 존재 여부와 영화 ID 형식 검증을 한 함수에서 처리했다.
- 해결: 양의 안전한 정수만 검사하도록 바꾸고 실제 ID 27205의 추가·복원 테스트를 작성했다. 저장 버전도 올려 더미 ID를 실제 ID로 잘못 복원하지 않도록 했다.
- 배운 점: 로컬 테스트용 데이터와 서버 데이터의 식별자 범위는 다르다. 저장 데이터의 의미가 바뀌면 호환성도 고려해야 한다.

### 4. 테스트용 DOM에서 스크롤 복원 경고 발생

- 이슈: `Not implemented: Window's scrollTo() method`
- 원인: jsdom에는 실제 브라우저의 스크롤 레이아웃 기능이 없다.
- 해결: 테스트 환경에서만 `window.scrollTo`를 mock했다. 실제 앱의 스크롤 동작이나 Console은 수정하지 않았다.
- 배운 점: 테스트 환경의 미지원 기능과 실제 브라우저 오류를 구분해야 한다.

### 5. 토큰을 입력했는데 미설정 안내가 계속 표시됨

- 이슈: `.env.example`에 실제 토큰을 넣었으나 영화 화면에 설정 안내가 표시됐다.
- 원인: `.env.example`은 예제 파일이며 Vite가 실제 환경 변수 파일로 읽지 않는다. 그대로 제출하면 토큰을 Git에 올릴 위험도 있다.
- 해결: 토큰이 든 파일은 `.env.local`로 이동하고, `.env.example`은 안내 문구만 있는 템플릿으로 복구했다. `.env.local`의 Git 제외와 Vite 자동 재시작을 확인한 뒤 실제 HTTP 200 응답을 검증했다.
- 배운 점: 예제 설정과 로컬 설정을 구분하고, 토큰을 출력하지 않은 채 설정 여부와 응답으로 동작을 확인해야 한다. `VITE_` 값은 브라우저에 포함되므로 비밀 저장소 역할은 하지 않는다.

## 최종 확인 체크리스트

- [x] `.env.local`에 실제 API Read Access Token을 넣고 개발 서버 재시작
- [x] 순수 fetch 버튼의 실제 성공과 공식 API의 URL·query·status·JSON 확인
- [ ] 개발자 도구 Network 패널을 직접 열어 요청·응답 확인
- [x] 목록·검색·상세의 실제 응답, 직접 접근·새로고침·뒤로가기 확인
- [x] 실제 상세 404 오류와 동일 ID 재시도 확인
- [ ] offline → online 전환 후 같은 조건의 재시도 확인
- [x] 실제 포스터·배경과 TMDB 출처 표기 확인
- [x] 실제 API 사용 상태에서 Console 재확인 및 빌드

토큰·Authorization header가 포함된 화면은 캡처해 공유하지 않는다. GitHub 제출은 이슈 [#38](https://github.com/SSUMC-11th-organization/PE_Web_C_FE/issues/38)과 `dominic/#38` 브랜치로 진행한다. Notion 원본과 피드백 시스템은 직접 수정·제출하지 않고, 사용자가 붙여 넣을 문서를 별도로 제공한다.
