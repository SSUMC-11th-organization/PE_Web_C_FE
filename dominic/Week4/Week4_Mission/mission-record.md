# 4주차 미션 기록

## 필수 미션

3주차 UMCine 화면을 복사하고 북마크를 Context에서 Zustand store로 옮겼습니다.
목록·검색·상세에서 공통 `BookmarkButton`을 사용하며, 같은 ID 배열을 기준으로 추가·해제 상태를 표시합니다.
영화 정보와 북마크 상태를 분리하여 store에는 영화 ID만 보관합니다. 초기값은 빈 배열입니다.

### 핵심 코드

북마크 변경은 이전 배열을 직접 수정하지 않고 새 배열로 반환합니다.

```ts
toggleBookmark: (movieId) => {
  if (!isMovieId(movieId)) return;
  set((state) => ({
    bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
      ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
      : [...state.bookmarkedMovieIds, movieId],
  }));
}
```

각 버튼은 자신에게 필요한 boolean과 action만 selector로 읽습니다.

```tsx
const bookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movie.id));
const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
```

`persist`가 JSON 저장·복원을 연결합니다. 실제 구현에는 JSON 변환과 런타임 검증을 함께 하는 저장소 어댑터를 적용했습니다.

```ts
{
  name: 'umcine-bookmark-store',
  storage: storageFor(initialMode),
  partialize: (state) => ({ bookmarkedMovieIds: state.bookmarkedMovieIds }),
  merge: (saved, current) => ({ ...current, ...validateBookmarks(saved) }),
}
```

`createValidatedStorage` 내부의 `createJSONStorage`가 JSON 변환을 담당하고, `validateBookmarks`는 타입·ID·중복을 검증합니다.
저장값이 없거나 손상되었으면 빈 배열을 사용합니다. 모양만 타입 단언으로 믿거나 저장된 함수를 복원하지 않습니다.

### 확인 결과

- 목록에서 북마크 추가 → 상세의 해제 버튼 → 검색의 같은 영화에도 해제 버튼이 표시되었습니다.
- 검색에서 첫 번째 영화 해제/다른 영화 추가 → 목록에 같은 상태가 반영되었습니다.
- 상세에서 해제한 뒤 목록으로 이동했을 때 북마크 개수와 버튼이 함께 바뀌었습니다.
- 상세 직접 접속·새로고침과 탭 종료 후 재접속에서 localStorage 북마크가 복원되었습니다.
- `북마크 초기화` 후 새로고침하면 0편이며, `북마크만 보기`에서는 빈 상태 안내가 표시되었습니다.
- 자동 테스트에서 미션 key와 JSON 형식, 초기화 시 다른 key 보존, 잘못된 JSON/ID/action, 저장소 차단·용량 초과를 검증했습니다.
- 390px 모바일 목록·검색은 가로 넘침 없이 표시되었습니다.
- 최종 명령 검사와 브라우저 Console 결과는 아래 검증 기록에 남겼습니다.

브라우저 앱 프로세스 전체 종료/재실행과 실제 개발자 도구 Application 패널 확인은 README의 수동 절차로 추가 확인할 수 있습니다.
이번 브라우저 검증은 새로고침·탭 종료/재접속까지, 자동 테스트는 동일 저장소를 사용하는 store 재생성까지 수행했습니다.

## 선택 미션

### 1. sessionStorage 유지 범위 비교

목록의 저장소 선택에서 localStorage와 sessionStorage를 전환할 수 있도록 했습니다.
두 저장소의 북마크는 별도로 유지하고, 모드 선택은 현재 탭의 sessionStorage에만 저장합니다.

- localStorage: ID 3을 저장하고 탭을 닫은 뒤 새 탭에서 다시 접속하자 복원되었습니다.
- sessionStorage: ID 1을 저장하고 같은 탭을 새로고침하자 모드와 북마크가 유지되었습니다.
- 탭을 닫고 새 탭으로 접속하면 local 기본 모드로 시작했습니다. session 모드를 다시 선택하자 북마크가 0편이었습니다.
- 자동 테스트에서도 저장소를 여러 번 전환해 어느 쪽도 덮어써지지 않는지 확인했습니다.

localStorage는 origin별로 브라우저 방문 간 유지되고, sessionStorage는 origin과 탭별로 구분됩니다.
단, 브라우저의 세션 복원·탭 복제 기능에서는 session이 복원/복사될 수 있으므로, 종료 후 새 탭으로 직접 접속하여 비교했습니다.
[MDN sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

### 2. 화면 설정 저장

영화 정렬(기본순·제목순·최신 개봉순)을 별도 Zustand store에 두고 `umcine-view-settings`에 저장했습니다.
제목순으로 바꾼 뒤 새로고침과 탭 종료/재접속에서도 선택값과 카드 순서가 유지되었습니다.
정렬은 원본 영화 배열을 복사한 뒤 수행하며 북마크 저장소와 관계없이 localStorage에 유지됩니다.

## 트러블 슈팅 / 설계상 해결한 문제

### 1. 저장값 삭제 후에도 기본 북마크가 남는 문제

- 원인: 3주차 더미 데이터의 `isBookmarked: true`를 초기값으로 사용하면 store를 비워도 초기 북마크가 다시 생깁니다.
- 해결: 영화 메타데이터에서 `isBookmarked`를 제거하고 Zustand의 ID 배열을 유일한 기준으로 사용했습니다.
- 배운 점: 초기 상태와 저장 상태를 구분하고, 같은 상태를 여러 곳에 중복 저장하지 않아야 합니다.

### 2. JSON 변환만으로는 저장값이 안전해지지 않음

- 원인: `createJSONStorage`는 JSON 변환만 처리합니다. 사용자가 저장값을 바꾸면 문자열 ID나 잘못된 배열도 들어올 수 있습니다.
- 해결: 복원 전에 객체/배열/양의 정수/실제 영화 ID/중복을 검증했습니다. 읽을 때 JSON 파싱 예외를 처리하고, 검증한 데이터만 병합하여 action을 보호했습니다.
- 배운 점: TypeScript 타입은 외부 저장값을 런타임에 검증하지 않습니다. 저장값도 `unknown`으로 확인해야 합니다.
- 근거: [Zustand persist 문서](https://zustand.docs.pmnd.rs/reference/middlewares/persist).

### 3. 저장소 전환 시 기존 값을 덮어쓸 위험

- 원인: 대상 저장소로 바꾼 뒤 빈 배열부터 `set`하면 persist가 먼저 빈 배열을 저장하여 기존 북마크를 지울 수 있습니다.
- 해결: `persist.setOptions`로 저장소를 바꾸고 `persist.rehydrate()`로 대상 값을 먼저 읽은 뒤 모드 선택을 업데이트했습니다.
- 배운 점: 저장과 복원의 순서는 데이터 보존에 직접 영향을 줍니다. 전환 왕복 테스트로 양쪽 값을 확인했습니다.

### 환경 확인 사항

`tsr generate`에서 기존과 같은 Node 경고가 출력됩니다.

```text
Warning: Accessing non-existent property 'replaceRouteChunk' of module exports inside circular dependency
```

라우트 생성·타입 검사·프로덕션 빌드는 성공했습니다. 이 경고는 브라우저 런타임 오류와 구분하여 기록했습니다.

## 검증 기록

- `pnpm check`: 통과 (48개 파일, 수정 사항 없음).
- `pnpm lint`: 통과.
- `pnpm typecheck` 및 `pnpm build`: 통과.
- `pnpm test`: 5개 테스트 파일, 60개 테스트 통과.
- 개발 화면: 북마크 추가/해제·화면 동기화·새로고침 복원·초기화·정렬 유지·sessionStorage 탭 수명 확인.
- 프로덕션 화면(`pnpm preview`): 목록·검색·상세 표시, 북마크 상세 새로고침 복원, 검색 이미지 로드 정상.
- 프로덕션 브라우저 Console: warning/error 없음.
- 모바일 목록·검색: viewport 390px, 문서 너비 390px로 가로 넘침 없음.

## 화면 증빙

- [목록](./docs/screenshots/movie-list-desktop.jpg)
- [검색에서 같은 북마크](./docs/screenshots/movie-search-desktop.jpg)
- [상세에서 같은 북마크](./docs/screenshots/movie-detail-desktop.jpg)
- [모바일 목록](./docs/screenshots/movie-list-mobile.jpg)
- [북마크 초기 빈 상태](./docs/screenshots/bookmarks-empty.jpg)
- [새 탭의 sessionStorage 빈 상태](./docs/screenshots/session-storage-new-tab.jpg)
