# 6주차 미션 기록

워크북: https://makeus-challenge.notion.site/6-TanStack-Query-bffb57f4596b8242869b81ae1396ca22

## 필수 미션

5주차 API 함수를 유지하고 목록·검색·상세의 Effect 요청을 useQuery 기반으로 전환했다.
목록 key는 page, 검색은 query/page, 상세는 ID를 포함한다.
로딩·오류·빈 결과·성공과 수동 재시도를 유지하고 캐시 데이터가 있으면 백그라운드 오류에도 화면을 유지한다.
QueryClientProvider와 개발 모드 ReactQueryDevtools를 추가했다.

### 구현 과정

5주차의 API 요청 함수와 응답 검증·adapter는 그대로 재사용했다. 화면에서 직접 요청 시점과 결과를 관리하던 코드는 Query가 담당하도록 바꾸고, 서버 데이터와 북마크 같은 클라이언트 상태를 분리했다. 북마크는 기존 Zustand store를 유지했다.

QueryClient는 컴포넌트가 렌더링될 때마다 새로 만들지 않고 모듈에서 한 번 생성한다. 앱 최상단의 Provider 아래에 라우터를 두어 화면을 이동해도 같은 캐시를 사용하도록 구성했다.

요청 조건에 따라 다음처럼 key를 구분했다.

- 목록: `['movies', 'list', page]`
- 검색: `['movies', 'search', query.trim(), page]`
- 상세: `['movies', 'detail', id]`

목록 페이지나 검색어가 달라지면 별도 캐시를 사용한다. 빈 검색어·잘못된 ID는 요청하지 않도록 enabled를 설정했다. 미조회 Query는 비활성화되어도 pending일 수 있으므로 빈 검색어 안내와 잘못된 ID 안내를 먼저 처리한다.

공통 hook은 Query 결과를 기존 화면에서 사용하는 로딩·오류·성공 상태로 연결한다. 성공 데이터가 빈 배열이면 빈 결과 안내를 보여주고, 실패 화면의 다시 시도 버튼은 refetch를 호출한다. 기존 캐시가 있는 백그라운드 재조회 실패에서는 데이터를 지우지 않는다.

## 선택 미션

queryOptions로 key·queryFn·enabled·개별 staleTime을 한곳에 모았다.
Query의 signal을 API 함수에 전달해 요청 취소도 유지했다.

화면마다 key와 요청 함수를 따로 작성하면 조건이 어긋날 수 있어 `src/queries/movies.ts`에 목록·검색·상세 팩터리를 만들었다. 각 화면은 팩터리의 반환값을 공통 Query hook에 전달하며, 상세의 개별 staleTime도 같은 위치에서 관리한다.

## 캐시 정책 및 검증

전역 staleTime 60초, gcTime 5분, 상세 staleTime 5분을 적용했다.

일반 조회 데이터는 1분 동안 최신으로 취급하고, 변경 빈도가 비교적 낮다고 가정한 상세 정보는 5분으로 정했다. 사용하지 않는 캐시는 마지막 구독이 사라진 뒤 5분 동안 보관한다. staleTime이 지나도 즉시 삭제되는 것은 아니며, 재방문·포커스 복귀 등의 조건에서 재조회될 수 있다.

이 캐시는 메모리에 저장된다. 화면 이동 후 재방문과 브라우저 전체 새로고침은 다르며, 별도의 영속화 기능은 구현하지 않았다. ky와 Query의 자동 재시도는 꺼 두고 수동 재시도 동작을 명확하게 확인하도록 했다.

fresh 재조회 시 요청 1회, staleTime 0일 때 요청 2회, 서로 다른 key 분리,
disabled 미조회 Query의 isPending=true/isLoading=false를 테스트했다.
자동 테스트 10개 파일·147개 통과.
실제 브라우저에서 인셉션 상세 API 성공과 Query Devtools의 Fresh 1, Fetching 0, Stale 0 및 ["movies","detail",27205] key를 확인했다. Console warn/error는 없었다.
캡처: [Query Devtools](./docs/screenshots/query-devtools.png)
Network 패널에서 요청 횟수를 직접 관찰하는 수동 확인은 아직 남아 있다.
전체 Biome 72개 파일·ESLint·타입 검사·프로덕션 빌드가 통과했다. 기존 router CLI의 replaceRouteChunk 경고는 남아 있다.

| 검증 항목 | 확인 결과 |
| --- | --- |
| 요청 구분 | 목록 페이지·검색어/페이지·상세 ID별 key가 겹치지 않는 테스트 통과 |
| fresh 캐시 | 같은 key를 연속 조회해 요청 함수가 1회 실행되는 것 확인 |
| stale 비교 | staleTime 0에서는 요청 함수가 2회 실행되는 것 확인 |
| 비활성 요청 | enabled=false인 미조회 Query의 isPending=true, isLoading=false 확인 |
| 실제 브라우저 | 인셉션 상세 정보와 Devtools의 fresh 상세 캐시 확인 |
| 기존 화면 회귀 | 로딩·오류·빈 결과·재시도·URL 페이지·북마크·이미지 처리를 포함한 테스트 통과 |
| 남은 확인 | Network 패널에서 화면 재방문 전후 실제 요청 횟수 비교 |

## 트러블슈팅

튜플 query key를 공통 hook에 전달할 때 enabled 콜백의 타입이 호환되지 않았다.
hook에 K extends QueryKey를 추가해 구체적인 key 타입을 보존했다.

- **원인:** 옵션의 query key를 일반 배열 타입으로 넓히면서, 구체적인 튜플 key를 사용하는 enabled 콜백과 타입이 맞지 않았다.
- **해결:** `useQueryRequest<T, K extends QueryKey>`와 `UseQueryOptions<T, Error, T, K>`로 데이터와 key의 타입 관계를 함께 전달했다.
- **배운 점:** 공통 hook을 만들 때 데이터 타입뿐 아니라 query key에 의존하는 옵션의 타입도 보존해야 한다. 타입 단언으로 숨기지 않고 타입 검사와 빌드로 확인했다.

## 확인 체크리스트

- [x] 필수 미션: 세 화면 Query 전환·상태 UI·캐시 정책·개발자 도구 적용
- [x] 선택 미션: queryOptions 팩터리 분리
- [x] 핵심 키워드 정리 및 자동 검사 통과
- [x] 실제 상세 API와 Query Devtools의 캐시 확인
- [ ] Network 패널에서 재방문 요청 횟수 직접 비교

Notion에는 완료한 검증과 남은 검증을 구분해 옮긴다. 토큰과 Authorization header는 기록·캡처에 포함하지 않는다.

GitHub 제출은 이슈 [#44](https://github.com/SSUMC-11th-organization/PE_Web_C_FE/issues/44)와 dominic/#44 브랜치에서 진행한다. Notion 직접 제출은 수행하지 않는다.
