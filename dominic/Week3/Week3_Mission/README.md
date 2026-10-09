# UMCine · Week 3

TanStack Router의 파일 기반 라우팅과 Tailwind CSS로 만든 영화 목록·검색·상세 화면입니다.
2주차 프로젝트는 수정하지 않고, 기존 영화 데이터와 포스터·배경·아이콘을 복사해 사용했습니다.

## 실행

```bash
pnpm install --frozen-lockfile
pnpm dev
```

개발 서버가 출력하는 주소로 접속합니다. 이번 작업의 실행 주소는 `http://127.0.0.1:5175/`입니다.

```bash
pnpm check
pnpm lint
pnpm test
pnpm build
```

`pnpm typecheck`와 `pnpm build`는 먼저 라우트 트리를 생성하므로 새로 설치한 환경에서도 실행할 수 있습니다.
`src/routeTree.gen.ts`는 자동 생성 파일이며 직접 수정하지 않습니다.

## 구현한 미션

| 구분 | 내용 | 결과 |
| --- | --- | --- |
| 필수 | `/` 영화 목록, `/search?query=...` 검색, `/movies/$movieId` 상세 | 완료 |
| 필수 | 로컬 데이터 검색, 검색어·결과 수·포스터·제목·원제·개봉일·줄거리 표시 | 완료 |
| 필수 | 빈 검색·결과 없음·존재하지 않는 영화 ID 안내 | 완료 |
| 필수 | 카드·검색 결과에서 상세 이동, 직접 URL 접속·새로고침 | 완료 |
| 필수 | 화면 CSS를 Tailwind utility로 전환, 조건부 class에 `cn` 사용 | 완료 |
| 필수 | Figma 데스크톱 비교, Console 오류 확인, `pnpm build` | 완료 |
| 선택 | 현재 화면에 맞는 헤더 메뉴만 활성화 | 완료 |
| 선택 | 모바일 반응형 카드 배치 | 완료 |

## 구조

```text
src/
├── routes/                  # URL 규칙과 page 연결
│   ├── __root.tsx
│   ├── index.tsx
│   ├── search.tsx
│   └── movies.$movieId.tsx
├── pages/movies/             # 목록·검색·상세 화면
├── components/
│   ├── layout/              # 공통 레이아웃·헤더·푸터·아이콘
│   └── movies/              # 카드·검색폼·평점·공유 영화 상태
├── data/movies.ts           # 제공된 영화 10편
├── types/movie.ts           # 공통 영화 타입
├── utils/                   # cn, 검색어 검증·검색·ID 조회, 테스트
├── router.ts                # 라우터 생성·타입 등록
├── main.tsx                 # RouterProvider
└── index.css                # Tailwind import·테마·기본 스타일
```

즐겨찾기는 공통 레이아웃의 `MovieProvider`에 두어 목록·상세 사이에서 유지합니다.
검색 결과와 상세 영화는 URL과 로컬 데이터로 다시 계산하므로 새로고침해도 같은 정보를 표시합니다.

## 범위

- API·인증 없이 제공된 로컬 데이터를 사용합니다. 로그인·내 정보는 이번 미션 대상이 아닙니다.
- 영화 상세의 평점·후기는 영화별로 현재 브라우저의 localStorage에 저장합니다. 서버에는 전송하지 않습니다.
- 즐겨찾기는 메모리 상태이므로 새로고침하면 제공 데이터의 기본값으로 돌아갑니다.
- 페이지 번호는 2주차 선택 미션의 활성 스타일 전환입니다. 실제 데이터 페이지 분할은 하지 않습니다.
- Figma의 화면 배치를 참고하되, 검색 결과 수·줄거리·이미지는 제공된 데이터와 에셋을 기준으로 표시합니다. 특히 제공된 `/movies/1` 배경 이미지는 Figma 예시 이미지와 다릅니다.

미션 기록과 트러블 슈팅은 [mission-record.md](./mission-record.md)에 정리했습니다.
에셋 출처는 [ASSET_SOURCES.md](./ASSET_SOURCES.md)를 확인하세요.

## 참고

- [3주차 워크북](https://makeus-challenge.notion.site/3-TanStack-Router-Tailwind-CSS-7e1b57f4596b83a6b1c98166c718f736)
- [TanStack Router · Vite 설치](https://tanstack.com/router/latest/docs/installation/with-vite)
- [Tailwind CSS · Vite 설치](https://tailwindcss.com/docs/installation/using-vite)
