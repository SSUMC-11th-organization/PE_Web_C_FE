# 4주차 핵심 키워드

## Web Storage

### 1. localStorage와 sessionStorage의 수명·공유 범위

`localStorage`는 같은 origin(프로토콜·호스트·포트)에서 공유하며, 직접 삭제하지 않으면 브라우저를 다시 열어도 유지됩니다.
`sessionStorage`는 origin뿐 아니라 탭별로 구분되고, 같은 탭의 새로고침에는 유지되지만 탭 세션이 끝나면 사라집니다.
이번 미션은 오래 유지할 북마크에 localStorage를 사용하고, sessionStorage로 바꿔 탭 종료 후 차이를 비교했습니다.
단, 세션 복원이나 opener가 있는 새 탭에서는 값이 복원·복사될 수 있습니다. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

### 2. 객체·배열을 JSON 문자열로 바꾸는 이유

Web Storage는 문자열만 저장하므로 배열을 그대로 넣으면 타입과 구조를 제대로 보존하지 못합니다.
`JSON.stringify`로 문자열로 저장하고 `JSON.parse`로 다시 배열이나 객체로 읽습니다.
읽을 때는 파싱 오류를 처리하고 타입·값을 검증해야 합니다. 이번 구현에서는 잘못된 ID와 중복을 제거했습니다.

```ts
localStorage.setItem('umcine-bookmarks', JSON.stringify([1, 3]));
const saved: unknown = JSON.parse(localStorage.getItem('umcine-bookmarks') ?? '[]');
// saved가 숫자 배열인지 검증한 다음 사용해요.
```

### 3. Web Storage에 적절한 데이터

북마크 ID, 영화 정렬, 테마처럼 브라우저에만 보관해도 되는 작은 비민감 설정이 적절합니다.
사용자가 값을 수정·삭제할 수 있으므로 서버의 원본 데이터나 권한 판단의 기준으로 사용하면 안 됩니다.
이번 미션에서는 영화 전체 대신 ID 배열과 정렬만 저장하며, 비밀번호·인증 토큰·민감한 개인정보는 저장하지 않습니다.
Web Storage는 동기 방식이므로 큰 데이터를 자주 읽고 쓰면 화면 반응에 영향을 줄 수 있습니다. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

## 클라이언트 상태와 전역 상태 관리

### 4. 컴포넌트 상태와 전역 상태의 사용 범위

컴포넌트 상태는 해당 화면이나 가까운 자식에서만 쓰는 값이고, 전역 상태는 여러 화면이 함께 사용하는 값입니다.
이번 미션에서는 검색 입력·평점 입력·북마크 필터는 로컬 상태로, 목록·검색·상세가 함께 쓰는 북마크는 Zustand로 관리했습니다.
몇 개의 가까운 컴포넌트만 공유한다면 공통 부모로 상태를 끌어올리고 props로 전달하는 것으로 충분합니다. [React](https://react.dev/learn/sharing-state-between-components)

### 5. 북마크를 전역으로 관리하는 장점과 비용

하나의 store를 기준으로 삼으면 한 화면에서 변경한 북마크가 다른 화면에도 바로 반영되어 상태가 서로 어긋나지 않습니다.
여러 단계로 props를 전달할 필요도 줄지만, 모든 값을 전역에 넣으면 화면 간 의존성과 초기화·구독 관리가 복잡해집니다.
이번 구현에서는 각 버튼이 자기 영화의 북마크 여부와 action만 selector로 읽어 불필요한 리렌더링을 줄였습니다.

```tsx
const bookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movie.id));
const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
```

### 6. Zustand와 Web Storage의 역할

Zustand는 실행 중인 앱에서 상태를 공유하고 변경 사항을 React 화면에 반영합니다.
Web Storage는 새로고침 후에도 값을 남기는 저장소이며, 값만 저장한다고 React가 자동으로 리렌더링되지는 않습니다.
`persist`는 둘을 연결해 store 변경을 저장하고 앱 시작 시 복원합니다. `partialize`는 저장할 값만 고르고, `createJSONStorage`는 JSON 변환을 담당합니다.
JSON 변환은 타입 검증이 아니므로 저장값의 형태와 ID는 따로 검증합니다. [Zustand](https://zustand.docs.pmnd.rs/reference/middlewares/persist)

## 헷갈리기 쉬운 구분

로컬/전역은 **어디에서 사용하는가**, 클라이언트/서버는 **누가 원본을 관리하는가**의 구분입니다.
이 미션의 북마크는 클라이언트 상태이면서 전역 상태이고, 나중에 API에서 받는 영화 정보는 서버 상태입니다.
전역 상태라고 자동으로 저장되지는 않으며, localStorage 북마크도 다른 기기나 사용자에게 자동으로 공유되지 않습니다.

워크북: [4주차 Web Storage 및 Zustand 상태 관리](https://makeus-challenge.notion.site/4-Web-Storage-Zustand-8e7b57f4596b8335a744012c234eea5d)
