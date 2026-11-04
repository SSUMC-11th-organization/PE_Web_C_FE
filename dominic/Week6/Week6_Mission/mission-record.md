# 6주차 미션 기록

워크북: https://makeus-challenge.notion.site/6-TanStack-Query-bffb57f4596b8242869b81ae1396ca22

## 필수 미션

5주차 API 함수를 유지하고 목록·검색·상세의 Effect 요청을 useQuery 기반으로 전환했다.
목록 key는 page, 검색은 query/page, 상세는 ID를 포함한다.
로딩·오류·빈 결과·성공과 수동 재시도를 유지하고 캐시 데이터가 있으면 백그라운드 오류에도 화면을 유지한다.
QueryClientProvider와 개발 모드 ReactQueryDevtools를 추가했다.

## 선택 미션

queryOptions로 key·queryFn·enabled·개별 staleTime을 한곳에 모았다.
Query의 signal을 API 함수에 전달해 요청 취소도 유지했다.

## 캐시 정책 및 검증

전역 staleTime 60초, gcTime 5분, 상세 staleTime 5분을 적용했다.
fresh 재조회 시 요청 1회, staleTime 0일 때 요청 2회, 서로 다른 key 분리,
disabled 미조회 Query의 isPending=true/isLoading=false를 테스트했다.
자동 테스트 10개 파일·147개 통과.
실제 브라우저에서 인셉션 상세 API 성공과 Query Devtools의 Fresh 1, Fetching 0, Stale 0 및 ["movies","detail",27205] key를 확인했다. Console warn/error는 없었다.
캡처: [Query Devtools](./docs/screenshots/query-devtools.png)
Network 패널에서 요청 횟수를 직접 관찰하는 수동 확인은 아직 남아 있다.
전체 Biome 72개 파일·ESLint·타입 검사·프로덕션 빌드가 통과했다. 기존 router CLI의 replaceRouteChunk 경고는 남아 있다.

## 트러블슈팅

튜플 query key를 공통 hook에 전달할 때 enabled 콜백의 타입이 호환되지 않았다.
hook에 K extends QueryKey를 추가해 구체적인 key 타입을 보존했다.

GitHub 제출은 이슈 [#44](https://github.com/SSUMC-11th-organization/PE_Web_C_FE/issues/44)와 dominic/#44 브랜치에서 진행한다. Notion 직접 제출은 수행하지 않는다.
