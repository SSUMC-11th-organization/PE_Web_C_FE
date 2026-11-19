# UMCine · 8주차

7주차 앱을 복사해 회원가입 useMutation 전환, JWT 로그인, 내 정보 조회·닉네임 수정, 서버 즐겨찾기와 평점 API를 연결했습니다. 이전 주차는 수정하지 않았습니다.

## 실행

Node.js와 pnpm을 준비합니다.

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
# TMDB Read Access Token과 VITE_API_BASE_URL 설정
pnpm dev --host 127.0.0.1 --port 5180 --strictPort
```

이미 .env.local이 있다면 덮어쓰지 말고 주소만 수정합니다. 기본 회원 API 주소는 로컬 8주차 서버인 http://127.0.0.1:3007입니다. 워크북 서버를 사용할 때는 http://localhost:8080으로 바꾸세요. 백엔드 CORS 허용 목록에는 http://127.0.0.1:5180과 http://localhost:5180을 추가해야 합니다.

현재 작업 환경에서는 기존 3007 서버를 보존하고, 같은 8주차 백엔드를 별도 3008 포트에서 실행해 검증했습니다. 프론트의 .env.local은 이 주소로 준비되어 있습니다.

```sh
# 별도 터미널: PE_Web_C_BE-week8-prep/dominic/Week8/Week8_Mission에서 실행
PORT=3008 CORS_ORIGINS=http://127.0.0.1:5180,http://localhost:5180 npm start
```

백엔드 DB와 JWT 설정은 백엔드 프로젝트에서 준비합니다. 이 프론트 PR은 백엔드 코드를 변경하거나 DB를 초기화하지 않습니다.

## 화면

| 주소 | 기능 |
| --- | --- |
| /signup | 입력 검증·중복 확인·회원가입 mutation |
| /login | 로그인, 실패 후 재시도, 토큰 저장·홈 이동. 로그인한 사용자는 홈으로 이동 |
| /my | 서버 회원 정보와 서버 즐겨찾기 목록 |
| /my/edit | 닉네임 PATCH, 캐시 직접 갱신/재조회 비교. 이메일은 API 계약에 맞춰 읽기 전용 |
| /movies/$movieId | 영화 상세, 즐겨찾기 상태·등록·해제, 내 평점 조회·등록·수정·삭제 |

내 정보는 Route Group의 pathless Layout Route 아래에 있습니다. URL에 그룹·레이아웃 이름은 나오지 않으며, 비로그인 접근은 /login으로 이동합니다. 로그인 여부뿐 아니라 서버의 /members/me로 토큰 유효성을 확인합니다. 401·로그아웃·계정 변경 시 개인 Query 캐시를 제거합니다. 로그아웃은 클라이언트 토큰을 지우며 서버 토큰 폐기나 Refresh Token은 구현 범위가 아닙니다.

Zustand에는 토큰만 persist하고 회원 정보·즐겨찾기·평점은 Query에 보관합니다. 이전 로컬 북마크 데이터는 서버에 자동 이전하지 않습니다.

## API 계약

성공 응답은 { isSuccess: true, result, ... } 형식이며 보호 요청에는 Bearer 토큰을 보냅니다. 실제 연결 서버의 GET /favorites는 [{ favoriteId, movieId, createdAt }], GET /favorites/:movieId는 { isFavorite }를 result에 담습니다. 프론트는 영화 메타데이터를 TMDB에서 조회합니다.

- 공개 요청: POST /members, POST /auth/login, 이메일·닉네임 중복 확인
- 회원 정보: GET/PATCH /members/me (PATCH는 nickname만)
- 즐겨찾기: GET/POST /favorites, GET/DELETE /favorites/:movieId
- 평점: GET /members/:memberId/ratings, POST /ratings, PATCH/DELETE /ratings/:ratingId

평점 쓰기 요청은 클라이언트가 memberId를 보내지 않습니다. 서버가 JWT로 소유자를 결정합니다. JWT의 sub를 읽는 것은 평점 조회 대상을 정하는 용도이며 서명 검증을 대신하지 않습니다.

## 검증

```sh
pnpm fix
pnpm check
pnpm lint
pnpm test
pnpm build
# 별도 로컬 회원 서버가 실행 중일 때만:
MEMBER_API_URL=http://127.0.0.1:3008 pnpm test:api
```

자동 테스트 176개와 실제 서버 HTTP 시나리오 21개 요청을 통과했습니다. test:api는 매번 새 실습 회원을 만들며 그 회원의 평점·즐겨찾기를 등록한 뒤 삭제합니다. 기존 회원 데이터와 테이블은 삭제하지 않습니다. 토큰·비밀번호·Authorization은 결과 파일에 기록하지 않습니다.

수정 화면의 '학습용 · 캐시 갱신 방식 비교'에서 모드를 바꾸어 확인할 수 있습니다. 같은 회원 Query를 활성화한 테스트에서 direct는 PATCH 이후 추가 GET 0회, invalidate는 추가 GET 1회였습니다. 브라우저 Network 패널로 재현할 때는 GET /members/me를 필터링하세요.

[핵심 키워드](../core-keywords.md) · [미션 기록](mission-record.md) · [실제 API 결과](docs/api-verification.json) · [워크북](https://makeus-challenge.notion.site/8-TanStack-Query-dcdb57f4596b821ab77881ce3e201d84)
