# UMCine Week 6

5주차를 보존하고 세 영화 화면을 TanStack Query v5로 전환했습니다.
이 폴더에서 pnpm install, pnpm dev --port 5178로 실행합니다.
로컬 TMDB .env.local은 이전 주차에서 복사했으며 Git 제외 대상입니다.

필수: 목록·검색·상세 Query 전환, 조건별 key, 로딩·오류·빈 결과·성공, 캐시 재사용, 개발 모드 Query Devtools.
선택: src/queries/movies.ts의 queryOptions 팩터리로 설정을 공유합니다.
기본 staleTime 1분, gcTime 5분, 상세 staleTime 5분입니다.
QueryClientProvider는 앱 최상단에 하나만 두며 북마크는 Zustand를 유지합니다.
캐시는 메모리에 보관되며 브라우저 새로고침 뒤 영속되지 않습니다.

검증: pnpm check, pnpm lint, pnpm test, pnpm build.
use-movie-request는 이전 방식 비교용이며 세 영화 화면은 use-query-request를 사용합니다.
실제 브라우저의 Query Devtools·Network 패널 직접 확인은 자동 테스트와 구분합니다.

[핵심 키워드](../core-keywords.md) · [미션 기록](./mission-record.md)
