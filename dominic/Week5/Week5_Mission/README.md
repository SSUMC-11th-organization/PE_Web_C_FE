# UMCine · Week 5

4주차 영화 UI를 별도 폴더로 복사한 뒤, 고정 더미 목록을 TMDB API로 교체했습니다. 4주차 파일은 수정하지 않았습니다.

## 실행

이 폴더에서 `pnpm install`을 실행합니다. `.env.example`을 같은 위치의 `.env.local`로 복사하고 **API Read Access Token**을 넣습니다.

```dotenv
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=본인의_API_Read_Access_Token
```

토큰 앞에 `Bearer`를 붙이지 않습니다. 환경 변수 변경 뒤에는 개발 서버를 다시 시작합니다.
`pnpm dev --host 127.0.0.1 --port 5177 --strictPort`로 실행하고 [로컬 앱](http://127.0.0.1:5177/)을 엽니다.

토큰은 [TMDB API 설정](https://www.themoviedb.org/settings/api)에서 발급합니다. 토큰이 없으면 더미 데이터로 성공한 척하지 않고 설정 안내를 표시합니다.
`.env.local`과 빌드 결과는 Git에서 제외됩니다. 단, `VITE_` 변수는 브라우저에 노출되므로 실제 서비스의 비밀 키는 백엔드에서 관리해야 합니다.

## 미션 구현

| 구분 | 구현 |
| --- | --- |
| 필수 · 순수 fetch | 목록의 ‘학습용 · 순수 fetch 요청 확인’을 펼쳐 클릭 실행. `response.ok` 검사 후 JSON 읽기 |
| 필수 · ky | 공통 인스턴스, 인기 영화·검색·상세 함수와 응답 타입 분리 |
| 필수 · 화면 | 로딩·오류·빈 결과·성공, 빈 검색어, 잘못된 ID, 상세 404 구분 |
| 필수 · 이미지·출처 | 포스터·배경 URL 변환, null/로드 실패 시 회색 ‘이미지 없음’, TMDB 로고와 출처 문구 |
| 선택 · 재시도 | 목록·검색·상세의 마지막 요청을 같은 조건으로 재실행 |
| 선택 · 페이지 | URL `page`와 TMDB query 연결, 이전/다음·페이지 버튼, 검색어 변경 시 1페이지 |
| 선택 · adapter | `toMovie`·`toMovieDetail`로 서버 응답과 UI 모델 분리 |

## 구조

```text
src/
├── api/
│   ├── tmdb-client.ts          # ky 2.x 공통 설정
│   └── movies/                # 응답 모델·fetch/ky 요청·런타임 검증
├── config/env.ts              # 누락 설정 안내, 잘못된 API 주소 차단
├── hooks/use-movie-request.ts # 로딩/오류/성공·취소·재시도
├── routes/                    # TanStack Router URL 검증
├── pages/movies/              # 목록·검색·상세
├── components/movies/         # 카드·이미지·페이지·오류·fetch 실습
├── stores/                    # 북마크·현재 페이지 정렬 설정
├── utils/movies/              # adapter·이미지 URL·경로 검증·오류 문구
└── test/                      # 모의 API fixture·화면 통합 테스트
```

API 함수는 `GET /movie/popular`, `GET /search/movie`, `GET /movie/{movie_id}`를 사용하며 한국어로 요청합니다.
`ky@2.2.0`의 `baseUrl`·`isHTTPError`를 사용하고, 자동 재시도는 꺼서 수동 재시도와 구분합니다.
요청 함수가 받은 JSON은 런타임 검증 후 adapter로 전달합니다. 타입 표기만 믿고 렌더링하지 않습니다.

## URL과 북마크

- 목록: `/?page=2`
- 검색: `/search?query=인셉션&page=2`
- 상세: `/movies/27205`
- 빈 검색어와 양의 안전한 정수가 아닌 ID는 서버에 요청하지 않습니다.
- URL 페이지는 1~500 범위로 검증하고, 버튼은 응답의 `total_pages`도 반영합니다.
- 라우트 key를 검색어·페이지·ID에 연결해 이전 화면 데이터를 잠깐 잘못 표시하지 않습니다.
- cleanup에서 요청을 취소하고 이전 응답의 상태 변경도 방지합니다.
- 북마크는 같은 Zustand store를 사용합니다. 고정 더미 ID whitelist 대신 양의 안전한 정수를 검증합니다.
- `umcine-bookmark-store`는 저장 버전을 1로 올렸습니다. 버전 0의 더미 ID를 실제 TMDB ID로 오인하지 않도록 복원하지 않습니다. 4주차 앱 자체의 동작은 바꾸지 않았습니다.
- 정렬과 ‘북마크만 보기’는 **현재 API 페이지**에만 적용됩니다. 북마크 개수는 전체 저장 ID 기준입니다.

## 검증

```sh
pnpm fix
pnpm check
pnpm lint
pnpm test
pnpm build
```

자동 검증은 토큰 없이 모의 응답으로 동작합니다. 화면 통합 테스트는 jsdom·메모리 라우터를 사용하며 **실제 브라우저/TMDB 성공 확인과 다릅니다.**
실제 응답 및 Network 패널 검증은 아래 절차로 별도 확인합니다. 결과는 [미션 기록](./mission-record.md)에 구현/검증/대기를 구분해 기록합니다.

토큰 설정 후 실제 목록·검색·상세 HTTP 200, 두 화면의 2페이지·새로고침·뒤로가기, 상세 404·재시도, 북마크 공유, 실제 이미지 로드까지 확인했습니다. 순수 fetch 버튼도 20편을 받았습니다. Network 패널과 offline→online 수동 검증은 Safari 사용을 마칠 때까지 보류해 달라는 사용자 요청에 따라 대기 상태입니다.

별도 추가된 `member-api-panel.tsx`를 보존했고 버튼 type·포맷 수정 반영을 확인했습니다. 현재 전체 Biome 68개 파일, 빌드·ESLint·테스트 141개가 통과합니다. 회원 API 기능 자체는 이번 검증 범위에 포함하지 않았습니다.

1. `.env.local`에 토큰을 넣고 서버를 재시작합니다.
2. Network를 열고 fetch 실습 버튼을 누릅니다. `movie/popular`, `language=ko-KR`, `page=1`, status, JSON `results`를 확인합니다. **토큰이 보이는 header 화면은 공유하지 않습니다.**
3. 목록 2페이지를 누르고 URL과 API의 `page=2`, 영화 변경을 확인합니다. 새로고침 후 같은 페이지인지 확인합니다.
4. ‘batman’처럼 결과가 여러 페이지인 검색어로 검색 2페이지에 이동합니다. 새 검색 시 page=1, 뒤로가기 후 이전 검색어·페이지가 복원되는지 확인합니다. ‘인셉션’은 검증 당시 1페이지만 있었습니다.
5. 상세 URL을 직접 열고 새로고침합니다. 제목·장르·상영 시간·포스터·배경과 북마크 공유를 확인합니다.
6. 잘못된 ID·존재하지 않는 ID·없는 검색어를 구분합니다. 네트워크를 잠시 offline으로 두어 오류를 만들고, online 복원 후 ‘다시 시도’를 확인합니다.
7. Console 오류를 확인하고 `pnpm build`를 다시 실행합니다.

기존 router CLI의 `replaceRouteChunk` 순환 의존성 경고가 빌드 앞에 출력될 수 있습니다. 타입 검사·빌드 성공 여부와 브라우저 Console 오류는 구분합니다.

## 학습 기록과 범위

- [핵심 키워드 11개](../core-keywords.md)
- [미션 기록·트러블슈팅](./mission-record.md)
- [워크북](https://makeus-challenge.notion.site/5-API-ec5b57f4596b834da7a481b209c1915f)
- 기존 UI용 아이콘·TMDB 로고를 재사용했습니다. 실제 영화 포스터는 TMDB 응답 URL을 사용하며, fixture는 테스트 전용입니다.
- 로그인·회원 API·서버 평점 저장·TanStack Query는 이번 범위가 아닙니다. 기존 평점은 해당 브라우저에만 저장합니다.
- GitHub 제출: [이슈 #38](https://github.com/SSUMC-11th-organization/PE_Web_C_FE/issues/38), [PR #39](https://github.com/SSUMC-11th-organization/PE_Web_C_FE/pull/39), `dominic/#38` → `dominic/main`. 이전 주차는 PR 변경 범위에 포함하지 않으며 머지는 하지 않았습니다.
- Notion 직접 편집·피드백 제출은 사용자가 진행합니다. [붙여 넣기용 문서](../notion-paste.md)에 핵심 키워드·미션 기록·트러블슈팅·제출 링크를 모았습니다.
