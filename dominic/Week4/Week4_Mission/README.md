# UMCine · Week 4

3주차 영화 목록·검색·상세 화면에 **Zustand + Web Storage 북마크**를 연결했습니다.
3주차 원본은 수정하지 않고 코드와 포스터·배경·아이콘을 복사했습니다.

## 실행

```bash
pnpm install --frozen-lockfile
pnpm dev --host 127.0.0.1 --port 5176
```

실행 주소: <http://127.0.0.1:5176/>. 저장소는 origin별로 구분되므로 `localhost`나 다른 포트로 바꾸면 별도의 값이 보입니다.

```bash
pnpm check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

라우트 트리는 자동 생성합니다. `src/routeTree.gen.ts`는 직접 수정하지 않습니다.

## 구현한 미션

- 필수: 목록·검색·상세의 공통 북마크 버튼이 동일한 Zustand store를 사용합니다.
- 필수: 추가·해제한 영화 ID만 `umcine-bookmark-store`에 JSON으로 저장하고 앱을 다시 열 때 복원합니다.
- 필수: 저장값이 없거나 삭제되었으면 초기 빈 배열로 돌아갑니다. 더미 데이터의 기본 북마크는 사용하지 않습니다.
- 선택: 목록 상단에서 `localStorage` / `sessionStorage`를 바꾸어 유지 범위를 비교할 수 있습니다.
- 선택: 기본순·제목순·최신 개봉순 정렬 설정을 localStorage에 저장합니다.
- 추가: 북마크 개수 표시, 북마크만 보기, 선택한 저장소의 북마크 초기화, 저장소 사용 불가 안내.

## 핵심 구조

```text
src/
├── stores/
│   ├── bookmark-store.ts         # 영화 ID·action·persist·저장소 전환
│   └── view-settings-store.ts    # 정렬 설정·persist
├── components/movies/
│   ├── bookmark-button.tsx       # 세 화면에서 재사용, boolean/action selector
│   └── view-settings.tsx         # 저장소·정렬 선택과 초기화
├── components/layout/
│   ├── header.tsx                # 북마크 개수
│   └── storage-notice.tsx        # 저장 실패 안내
├── data/movies.ts                # 변경하지 않는 영화 정보
├── pages/movies/                 # 목록·검색·상세 화면
└── utils/
    ├── browser-storage.ts       # 저장소 예외 처리·JSON 복원 검증
    ├── bookmark-storage.ts      # Web Storage 직접 사용 미니 실습
    └── movie-sort.ts            # 원본 배열을 수정하지 않는 정렬
```

북마크는 ID 배열 하나로 관리하며 영화 정보에 `isBookmarked`를 중복 저장하지 않습니다.
`MovieProvider`/Context는 제거했고, 공통 `BookmarkButton`이 해당 영화의 북마크 여부와 action만 구독합니다.
검색 입력·평점 입력·북마크 필터는 필요한 화면의 로컬 상태에 그대로 둡니다.

## 저장 key

| key | 저장소 | 내용 |
| --- | --- | --- |
| `umcine-bookmark-store` | 기본 localStorage / 비교 시 sessionStorage | `{ "state": { "bookmarkedMovieIds": [1, 3] }, "version": 0 }` |
| `umcine-view-settings` | localStorage | 정렬 설정 |
| `umcine-bookmark-storage-mode` | sessionStorage | 현재 탭의 저장소 선택 (`local` / `session`) |
| `umcine-bookmarks` | 미니 실습에서만 사용 | `JSON.stringify` / `JSON.parse`로 읽고 쓰는 ID 배열 |

두 저장소의 북마크는 별도입니다. 모드 변경 시 기존 값을 옮기거나 삭제하지 않고 **대상 저장소에 있던 값**을 복원합니다.
같은 탭 새로고침은 모드 선택도 유지합니다. 탭을 닫고 새로 열면 기본 localStorage로 시작하며, session 모드로 바꾸면 빈 북마크를 확인할 수 있습니다.

잘못된 JSON·데이터 형태·중복 ID·존재하지 않는 ID는 안전하게 정리합니다.
`partialize`로 데이터만 저장하고, 검증된 데이터만 `merge`하여 저장값이 action 함수를 덮어쓰지 못하게 합니다.
저장소 차단이나 용량 초과 시 앱은 메모리 상태로 동작하며 저장 실패 안내가 표시됩니다.

## 수동 확인 방법

1. 목록에서 즐겨찾기를 누르고 검색·상세에서도 같은 상태인지 확인합니다.
2. 같은 주소에서 새로고침하거나 탭을 닫고 다시 접속해 북마크와 정렬을 확인합니다.
3. 브라우저 개발자 도구 → Application → Local Storage → 실행 주소 → `umcine-bookmark-store` 값을 확인합니다.
4. 이 key만 삭제하고 새로고침하면 북마크가 빈 상태로 돌아옵니다. UI의 `북마크 초기화`도 같은 key만 삭제합니다.
5. sessionStorage 모드에서 북마크 후 새로고침합니다. 탭을 닫아 새 탭으로 접속한 뒤 다시 session 모드를 선택하면 빈 상태입니다.
6. 브라우저 앱을 완전히 종료했다 다시 실행하는 확인은 사용자 환경에서 추가로 진행하세요. 이번 검증은 새로고침·탭 종료/재접속과 store 재생성까지 수행했습니다.

## 범위

- API·인증·서버 동기화 없이 해당 브라우저에만 저장합니다. 비밀번호·인증 토큰은 저장하지 않습니다.
- 이미 열려 있는 다른 탭의 Zustand 메모리는 실시간 동기화하지 않으며, 새로고침할 때 저장값을 읽습니다.
- 기존 영화별 평점·후기 localStorage 기능은 유지했습니다.
- 기존 페이지 번호는 활성 스타일 전환이며 실제 데이터 페이지 분할은 아닙니다.
- 노션 페이지 직접 편집과 AI 피드백 제출은 별도로 진행합니다.

핵심 키워드: [core-keywords.md](../core-keywords.md).
미션 기록과 트러블 슈팅: [mission-record.md](./mission-record.md). 에셋 출처: [ASSET_SOURCES.md](./ASSET_SOURCES.md).

## 참고

- [4주차 워크북](https://makeus-challenge.notion.site/4-Web-Storage-Zustand-8e7b57f4596b8335a744012c234eea5d)
- [Zustand persist](https://zustand.docs.pmnd.rs/reference/middlewares/persist)
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
