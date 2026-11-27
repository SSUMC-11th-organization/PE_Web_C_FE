# 9주차 미션 기록

## 필수 미션 · TanStack Router → Next.js 마이그레이션

### 1. 별도 프로젝트와 App Router 구성

8주차 코드를 `Week9/Week9_Mission`으로 복사한 뒤 Vite 진입점·라우터 생성 파일·전용 의존성을 제거했다. Next.js 16.4.6, Tailwind PostCSS, Next TypeScript 설정으로 바꿨다. 기존 포스터·아이콘·스타일을 유지했다.

`createFileRoute`를 `app/**/page.tsx`로 옮겼다. `/movies/$movieId`는 `/movies/[movieId]`가 되었고 `params`를 await해 읽는다. 목록·검색의 `searchParams`를 검증해 잘못된 페이지는 1페이지로 처리한다. 검색어·페이지 번호를 URL에 유지한다.

`Link`는 `next/link`, `useNavigate`는 `useRouter().push/replace`, `useRouterState`는 `usePathname`으로 교체했다. 공통 화면은 루트 `layout.tsx`, 보호 화면은 `(authenticated)/layout.tsx`에서 `children`을 렌더링한다. 그룹 이름은 URL에 나타나지 않는다.

### 2. Server/Client 경계와 브라우저 저장소

페이지와 루트 레이아웃은 Server Component로 두고, 입력·클릭·Query 훅이 필요한 화면을 Client Component로 분리했다. Query Provider 안에 서버에서 만든 `children`을 전달하는 구조를 사용했다. 서버 렌더마다 새 QueryClient를 만들며 개인 캐시를 서버에서 공유하지 않는다.

기존 Zustand persist는 토큰·정렬을 모듈 로딩 시 복원했다. Next 첫 화면의 서버 HTML과 맞추기 위해 `skipHydration`으로 복원을 미루고 `Providers`의 effect에서 `rehydrate()`한다. 보호 레이아웃은 복원 완료 후 로그인 여부와 `/members/me` 응답을 확인한다. 비로그인·로그아웃·401에서는 보호 내용을 숨기고 로그인 화면으로 이동한다.

서버 쿠키 세션으로 바꾼 것은 아니며 권한 검증은 기존 백엔드 JWT Guard가 담당한다. 회원 토큰은 브라우저 저장소, 회원 정보·즐겨찾기·평점은 Query 캐시라는 기존 분리를 유지했다.

### 3. 서버 데이터 조회와 API 유지

공개 영화 목록·검색·상세는 `src/server/tmdb.ts`에서 요청하고 `MovieHydration`의 요청별 QueryClient에 저장한다. `dehydrate`와 `HydrationBoundary`로 브라우저 Query가 이어받는다. HTML 직접 조회에서도 영화 카드와 검색 결과·상세 내용이 포함됨을 검증했다.

TMDB 토큰은 `VITE_TMDB_ACCESS_TOKEN`에서 서버 전용 `TMDB_ACCESS_TOKEN`으로 옮겼다. 브라우저의 ky·fetch 요청은 `/api/tmdb/...`를 사용한다. Route Handler는 인기 목록·검색·양의 ID 상세만 허용하며 임의 URL·인증 발급 API를 전달하지 않는다. 응답은 기존 런타임 검증을 유지하고 upstream 오류 원문·헤더·토큰은 반환하지 않는다.

회원가입 중복 확인, 로그인 실패·성공, 내 정보 조회·닉네임 수정, 서버 즐겨찾기와 평점 등록·수정·삭제 API를 유지했다. mutationOptions, 세션별 Query key, 로그아웃 캐시 정리와 이전 세션의 늦은 응답 방지도 유지했다.

### 4. 이미지·폰트·메타데이터와 렌더링 확인

- `next/image`에 크기·반응형 `sizes`와 TMDB `remotePatterns`를 설정했다. 이미지가 없거나 실패하면 대체 영역을 표시한다.
- `next/font/local`로 설치된 Geist 폰트를 자체 호스팅한다. 한글은 시스템 폰트를 사용한다.
- Metadata API로 페이지별 제목과 설명, 상세 영화의 Open Graph 정보·포스터를 설정했다.
- `/about`은 빌드 결과가 `○`인 정적 페이지다. `/`, `/search`, `/movies/[movieId]`는 `ƒ`로 출력됐다. 서버 영화 데이터의 300초 재검증을 페이지 전체 ISR과 동일하다고 기록하지 않았다.
- 워크북의 Cache Components 예제와 달리 이번 프로젝트는 해당 옵션을 켜지 않았으므로 `◐` 부분 사전 렌더링을 구현했다고 주장하지 않는다.

## 최종 검증

| 확인                                  | 결과                                                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Biome·ESLint·TypeScript·프로덕션 빌드 | 통과                                                                                                                                                  |
| 자동 테스트                           | 13개 파일, 163개 통과. 화면 navigation·API는 모의 구현                                                                                                |
| 실제 회원 서버 HTTP 시나리오          | 21개 요청 통과. 가입·실패/성공 로그인·회원 수정·즐겨찾기·평점 CRUD                                                                                    |
| Next production HTTP 검사             | 목록·검색·상세·소개 200, 없는 페이지·허용하지 않은 TMDB 경로 404                                                                                      |
| 서버 렌더링                           | 브라우저 JS를 실행하지 않은 HTML에도 카드·검색 결과·상세 제목 포함                                                                                    |
| 토큰 비노출                           | 초기 HTML 및 브라우저 JS 39개에서 실제 TMDB 토큰 미검출                                                                                               |
| 실제 브라우저                         | 목록 2페이지, 검색, 보호 경로, 가입·실패/성공 로그인, 즐겨찾기 등록·해제, 평점 4점→5점→삭제, 닉네임 수정, 새로고침 복원, 보호 화면 로그아웃 이동 확인 |
| 저장소·모바일                         | 제목순 정렬 새로고침 복원. 390px `/my`, `/my/edit` 가로 넘침 없음                                                                                     |
| Console                               | 최종 목록·상세 검증 시 경고·오류 없음                                                                                                                 |

새 테스트 회원을 사용했고 그 회원이 만든 평점·즐겨찾기는 삭제했다. 회원 자체는 남는다. 수동 브라우저에서 요청 횟수를 센 것은 아니며, 캐시 갱신 방식 비교는 모의 Query 테스트로 검증했다.

- [실제 회원 API 결과](docs/api-verification.json)
- [Next HTTP·토큰 비노출 검사 결과](docs/next-verification.json)
- [프로덕션 화면](docs/movie-list.png)

## 트러블 슈팅

### 1. 기존 `pages` 폴더가 Pages Router로 인식됨

- **이슈 원문**: `Property 'default' is missing in type 'typeof import(".../src/pages/auth/login-page")' but required in type 'PagesPageConfig'.`
- **원인**: Vite에서 화면 구분용으로 쓴 `src/pages`를 Next.js가 Pages Router의 라우트 폴더로 인식했다. App Router와 별도로 불필요한 경로를 검사했다.
- **해결**: 화면 폴더를 `src/screens`로 바꾸고 import를 수정했다. 라우트 정의는 `src/app`에만 둔다.
- **배운 점**: 마이그레이션에서는 라이브러리 API뿐 아니라 새 프레임워크의 예약 폴더와 파일 규칙도 확인해야 한다.

### 2. Turbopack의 PostCSS 작업이 실행 환경에서 실패함

- **이슈 원문**: `Failed to write app endpoint /page` → `creating new process` → `binding to a port` → `Operation not permitted (os error 1)`
- **원인**: 이 실행 환경에서 Turbopack의 PostCSS 평가 작업에 필요한 프로세스·포트 동작이 제한됐다. Next 타입 검사와 테스트 실패와는 별개의 문제였다.
- **해결**: 개발·빌드 명령에 Next가 제공하는 `--webpack`을 명시했다. Webpack 빌드와 production 서버가 정상 동작함을 확인했다.
- **배운 점**: 실패한 단계와 환경 원인을 분리하고, 지원되는 대안으로 실행한 결과를 기록해야 한다.

### 3. 브라우저 저장소 복원과 첫 렌더의 불일치 방지

- **점검 사항**: Client Component도 초기 HTML은 서버에서 생성할 수 있으므로 즉시 localStorage를 복원하면 로그인 표시·정렬 결과가 서버와 달라질 수 있다.
- **처리**: persist 자동 복원을 미루고 effect에서 복원한다. 인증 레이아웃은 복원 완료를 구독하고 그 전에는 개인 내용을 렌더링하지 않는다.
- **확인**: 로그인한 상태에서 상세·`/my/edit`를 새로고침해도 로그인 상태가 유지됐다. 정렬을 제목순으로 바꾼 뒤 새로고침해도 복원됐고 Console에 hydration 오류가 없었다.
- **배운 점**: `"use client"`는 브라우저 API를 렌더링 시점에 무조건 사용할 수 있다는 뜻이 아니다.

## 회고

라우터 이름을 바꾸는 작업보다 서버와 브라우저의 실행 시점을 구분하는 일이 중요했다. 공개 영화 데이터는 서버에서 먼저 준비하고 입력·개인 상태는 클라이언트에서 관리하니 각 코드의 역할이 분명해졌다. 다음에는 쿠키 기반 인증과 서버 측 보호 경로가 필요한지 요구사항에 맞춰 검토하고, 배포 환경에서도 캐시·이미지 동작을 확인하고 싶다.
