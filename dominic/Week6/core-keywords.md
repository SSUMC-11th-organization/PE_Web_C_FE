# 6주차 핵심 키워드

## 1. query key를 구분하는 이유

같은 key는 같은 데이터의 캐시로 취급합니다. 목록·검색·상세에 같은 key를 쓰면 서로 다른 응답을 잘못 재사용할 수 있습니다.
이번 구현은 목록 page, 검색어/page, 상세 ID를 포함합니다. 요청 결과에 영향을 주는 조건은 key에도 포함합니다.

## 2. enabled=false와 isPending/isLoading

isPending은 성공 데이터가 아직 없는 상태이므로 요청을 비활성화해도 참일 수 있습니다.
isLoading은 isPending && isFetching이므로 비활성화된 미조회 Query에서는 거짓입니다.
빈 검색어 안내는 로딩 표시보다 먼저 구분해야 합니다.

## 3. staleTime과 gcTime

staleTime은 데이터 갱신 시점부터 최신으로 취급할 기간입니다. 지나면 stale이 되지만 즉시 삭제하거나 그 순간 자동 요청하는 타이머는 아닙니다.
gcTime은 구독자가 없어 비활성화된 뒤 캐시를 보관할 기간입니다. 이후 사용하지 않는 캐시가 수거됩니다.
stale 데이터는 재마운트·포커스 복귀 등의 조건에서 재조회될 수 있습니다.

## 4. 전역과 개별 staleTime 기준

일반적인 갱신 빈도는 전역 기본값으로 정하고 특별한 데이터는 개별 query에서 덮어씁니다.
이번 앱은 기본 1분, 상세 5분입니다. 데이터 변경 빈도·정확성 요구·요청 비용을 함께 고려합니다.

queryOptions는 요청 설정 재사용, QueryClient는 캐시 소유, Zustand는 북마크 같은 클라이언트 상태를 담당합니다.
메모리 캐시는 기본적으로 브라우저 새로고침 뒤에도 유지되는 저장소가 아닙니다.

공식 문서: [기본 설정](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults), [queryOptions](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)
