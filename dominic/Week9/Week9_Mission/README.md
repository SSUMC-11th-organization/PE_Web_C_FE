# UMCine · 9주차

8주차 UMCine를 별도 Next.js 16.4.6 App Router 프로젝트로 마이그레이션했습니다. 이전 주차 폴더는 수정하지 않았습니다. 기존 포스터·아이콘도 `public`에 복사했습니다.

## 실행

Node.js 22.13 이상과 pnpm을 사용합니다. 검증 환경은 Node.js 25.3.0, pnpm 12.4.2입니다.

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
# TMDB_ACCESS_TOKEN과 NEXT_PUBLIC_API_BASE_URL을 설정
pnpm dev --hostname 127.0.0.1 --port 5190
```

이미 `.env.local`이 있다면 덮어쓰지 않습니다. 현재 작업 환경에는 8주차 설정을 복사·변환해 두었습니다. TMDB 토큰은 **`TMDB_ACCESS_TOKEN`**이며 `NEXT_PUBLIC_`을 붙이지 않습니다. 회원 API는 기본 `http://127.0.0.1:3008`입니다.

로컬 8주차 백엔드를 사용할 때는 해당 프로젝트에서 다음과 같이 실행합니다. DB 초기화는 필요하지 않습니다.

```sh
PORT=3008 CORS_ORIGINS=http://127.0.0.1:5190,http://localhost:5190 npm start
```

운영 빌드 확인:

```sh
pnpm build
pnpm start --hostname 127.0.0.1 --port 5190
```

이 작업 환경의 Turbopack PostCSS 처리에서 `binding to a port / Operation not permitted (os error 1)`가 발생해 개발·빌드 스크립트에 `--webpack`을 명시했습니다.

## 화면과 구조

| URL                          | 기능                                                 | 구현 위치                       |
| ---------------------------- | ---------------------------------------------------- | ------------------------------- |
| `/`                          | 인기 영화·페이지 이동·정렬·현재 페이지 즐겨찾기 필터 | `app/page.tsx`                  |
| `/search?query=...&page=...` | 영화 검색·URL 상태 복원                              | `app/search/page.tsx`           |
| `/movies/[movieId]`          | 상세·서버 즐겨찾기·평점 CRUD                         | `app/movies/[movieId]/page.tsx` |
| `/signup`, `/login`          | 중복 확인·가입·로그인 mutation                       | `app/signup`, `app/login`       |
| `/my`, `/my/edit`            | 회원 정보·즐겨찾기·닉네임 수정                       | `app/(authenticated)/my`        |
| `/about`                     | 서비스 소개·정적 생성 비교                           | `app/about/page.tsx`            |

- `src/app`: Next 라우트, 공통·인증 레이아웃, 로딩·오류·404, Metadata.
- `src/screens`: 상호작용하는 기존 화면. `pages`는 Next 예약 이름이어서 변경했습니다.
- `src/server`: 공개 영화 데이터 조회와 요청별 Query 캐시 직렬화.
- `src/components`: 폼·카드·검색·평점·헤더. `next/image`와 기존 스타일을 사용합니다.
- `src/queries`, `src/api`: TanStack Query와 ky 기반 회원·즐겨찾기·평점 요청.
- `src/stores`: 토큰·정렬 설정. effect 이후 저장소를 복원합니다.

Server Component가 공개 데이터를 조회해 `HydrationBoundary`로 넘깁니다. 브라우저는 같은 Query key로 이어받고, 재조회는 자체 `/api/tmdb` Route Handler를 호출합니다. 서버 요청은 허용한 TMDB 조회 경로만 전달합니다.

회원 토큰은 8주차 방식인 Zustand persist를 유지합니다. 보호 화면은 저장소 복원과 `GET /members/me`가 끝난 뒤 표시하며, 실제 권한은 백엔드 JWT Guard가 검증합니다. 서버 쿠키 세션이나 서버 측 로그인 redirect를 구현한 것은 아닙니다. 로그아웃 시 개인 Query를 제거합니다.

## 확인

```sh
pnpm check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
# 위의 production 서버와 회원 서버가 실행 중일 때:
pnpm test:next
pnpm test:api
```

자동 테스트의 navigation과 API는 모의 구현이며 실제 Next 라우팅 검증을 대신하지 않습니다. 별도로 production 서버에서 HTML·메타데이터·404·토큰 비노출을 검사하고 실제 브라우저에서 링크·검색·로그인·즐겨찾기·평점·새로고침을 확인했습니다.

`test:api`는 새 실습 회원을 만들고 그 회원의 평점·즐겨찾기를 삭제합니다. 가입한 실습 회원은 남으며 기존 회원 데이터는 변경하지 않습니다. 비밀번호·토큰·Authorization은 결과 파일에 저장하지 않습니다.

[미션 기록](mission-record.md) · [핵심 키워드](../core-keywords.md) · [워크북](https://makeus-challenge.notion.site/9-Next-js-406b57f4596b8205b87001808771a5f7)
