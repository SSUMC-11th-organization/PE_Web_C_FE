# 8주차 핵심 키워드

## 클라이언트 상태와 서버 상태

**입력값, 로그인 토큰과 회원 정보는 어디서 관리할까?**

| 상태 | 원본과 관리 위치 | 이번 구현 |
| --- | --- | --- |
| 입력 중인 이메일·비밀번호·닉네임 | 현재 화면이 가진 임시 값. 컴포넌트의 useState | 다른 화면과 공유할 필요가 없고 제출 전까지 서버 원본과 다를 수 있다. |
| 로그인 토큰 | 서버가 발급하지만, 이후 요청에 사용할 사본은 클라이언트에서 관리 | Zustand와 persist로 토큰만 localStorage에 저장한다. 토큰 유효성은 서버가 검증한다. |
| 회원 정보·즐겨찾기·평점 | 원본은 서버. 조회한 사본은 Query 캐시로 관리 | useQuery로 조회하고 mutation 성공 후 관련 캐시를 갱신한다. |

**같은 회원 정보를 전역 store와 Query 캐시에 모두 저장하면?**

한쪽만 갱신하면 헤더에는 이전 닉네임, 마이페이지에는 새 닉네임이 보이는 문제가 생긴다. 두 저장소를 계속 맞춰야 하고 갱신 순서도 복잡해진다. 그래서 회원 정보는 Query 캐시에만 두고 헤더·마이페이지·수정 화면이 같은 key를 사용하도록 했다.

## 캐시 일관성

**서버에서 수정했는데 다른 화면에는 이전 값이 보이는 이유는?**

수정 API가 서버 데이터를 바꿨다고 브라우저의 조회 캐시도 자동으로 바뀌는 것은 아니다. 다른 화면이 기존 캐시를 사용하거나 서로 다른 key로 같은 정보를 관리하면 이전 값이 보일 수 있다. 수정 성공 후 해당 데이터를 사용하는 Query key를 정확히 갱신해야 한다.

**다시 조회하기와 캐시 직접 수정은 언제 선택할까?**

| 방식 | 동작 | 적절한 상황 | 이번 예시 |
| --- | --- | --- | --- |
| invalidateQueries | 관련 캐시를 stale로 만들고 기본적으로 활성 Query를 다시 조회 | 응답에 최신 데이터가 없거나 서버 계산·정렬 결과까지 다시 받아야 할 때 | 평점 수정·삭제 후 목록 재조회 |
| setQueryData | 지정한 key에 데이터를 동기적으로 저장. 이 호출 자체는 네트워크 요청을 하지 않음 | 성공 응답에 조회와 같은 형태의 최신 데이터가 있을 때 | 닉네임 수정 응답으로 헤더·마이페이지 즉시 갱신 |

두 방식 모두 불변성을 지켜야 하며, 서버 응답 전에 값을 먼저 바꾸는 낙관적 업데이트와는 구분한다. 이번 직접 갱신은 PATCH가 성공한 후 실행한다. 비교 테스트에서는 최초 GET 이후 direct 방식에 추가 GET 0회, invalidate 방식에 추가 GET 1회를 확인했다. 다른 stale 조건이나 포커스 갱신이 있으면 별도의 조회가 발생할 수 있다.

추가로 mutationOptions는 mutationFn·retry·캐시 갱신 규칙을 재사용하도록 묶는다. useMutation의 isPending·isError·isSuccess로 요청 상태를 표현하고, 조회에는 useQuery를 사용한다.

참고: [TanStack Query Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations), [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation), [Updates from Mutation Responses](https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses).
