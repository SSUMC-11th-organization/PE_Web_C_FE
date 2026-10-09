# UMCine 2주차 필수·선택 미션

Figma의 **영화 목록** 프레임(129:2)을 바탕으로 새로 만든 React + TypeScript 프로젝트입니다. 기존 미션 코드는 사용하지 않았고, 제공된 포스터와 아이콘을 `public/images`, `public/icons`에 복사해 사용했습니다.

## 실행

```bash
pnpm install
pnpm dev
```

검증: `pnpm build`, `pnpm lint`

## 구현 내용

- `src/types/movie.ts`: 영화 데이터 형태를 `Movie` 인터페이스로 정의
- `src/data/movies.ts`: 워크북의 영화 10개 더미 데이터와 전체 필드
- `src/components/`: 헤더, 영화 카드, 그리드, 페이지 버튼 분리
- `src/app.tsx`: `useState`로 영화 목록·페이지·검색어·장르를 관리. 북마크 클릭 시 `map`과 객체 전개로 해당 영화만 불변 업데이트
- `src/app.tsx`, `src/components/pagination.tsx`: 현재 페이지를 `useState`로 관리하고 1~5 중 선택한 번호만 활성화
- `src/app.css`: Figma 데스크톱 레이아웃과 화면 폭별 3열·2열·1열 그리드

북마크, 제목 검색, 장르 필터, 페이지 선택 상태가 동작합니다. 페이지 버튼은 **활성 번호만 전환**하며 영화 데이터 자체를 페이지별로 교체하지는 않습니다. 로그인 항목은 디자인 재현을 위한 표시 요소입니다.

## 미션 기록

- 필수: 제공된 포스터·아이콘을 사용해 영화 10편을 표시하고, `Movie` 타입·데이터·헤더·카드·그리드·페이지 컴포넌트를 분리했습니다. 부모의 `movies` 상태를 `map`과 전개 문법으로 갱신해 클릭한 카드의 북마크만 바뀝니다.
- 선택: 미디어 쿼리로 5열(데스크톱) → 3열 → 2열 → 1열을 적용했습니다. `currentPage`를 상태로 두고 1~5 버튼과 이전·다음 버튼의 활성 상태를 바꿉니다.
- 확인: `pnpm build`, `pnpm lint` 통과. 브라우저에서 포스터 10개 로딩, 북마크 및 페이지 번호 변경을 확인했습니다.

이미지 출처는 [ASSET_SOURCES.md](./ASSET_SOURCES.md)를 참고하세요.
