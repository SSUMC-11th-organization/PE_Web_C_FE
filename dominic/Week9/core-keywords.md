# 9주차 핵심 키워드

## 프레임워크의 역할

**Next.js는 TanStack Router에 더해 어떤 기능을 제공하나요?**

TanStack Router는 URL과 화면 연결을 담당한다. Next.js는 App Router의 파일 기반 라우팅에 서버 렌더링, Server Component, 서버 데이터 조회, 이미지·폰트 최적화와 메타데이터 API 등을 함께 제공한다. 이번에는 `createFileRoute`를 `app/**/page.tsx`로, `Outlet`을 `layout.tsx`의 `children`으로 바꿨다. TanStack Query는 서버 데이터 캐시와 mutation을 위해 그대로 사용한다.

**고객 대상 서비스와 사내 서비스 등 상황이 달라져도 Next.js가 항상 가장 좋은 선택일까요?**

항상 그렇지는 않다. 검색 노출과 첫 화면의 서버 렌더링이 중요한 서비스에는 이점이 있지만, 로그인 후 사용하는 사내 도구에는 Vite 기반 SPA도 충분할 수 있다. 배포 환경, 유지보수 비용, 팀의 경험과 요구 기능을 보고 선택한다. UMCine는 공개 영화 상세·검색 페이지를 서버에서 준비하고 제목과 공유 정보를 설정할 수 있다는 점을 활용했다.

## Server Component와 Client Component

**어떤 기준으로 나누면 좋을까요?**

서버 데이터 조회·비밀키 사용·페이지 구성은 Server Component에, 클릭·입력·상태·브라우저 저장소는 Client Component에 둔다. `app/page.tsx`와 `MovieHydration`은 서버에서 공개 영화 데이터를 읽고, 검색 폼·평점 폼·회원 화면은 클라이언트에서 상호작용한다. 회원 토큰은 기존 방식대로 브라우저에 보관하고 개인 정보는 서버 렌더링 캐시에 넣지 않는다.

**`"use client"`를 `page.tsx` 최상단에 선언해도 될까요?**

선언할 수 있다. 다만 해당 파일이 클라이언트 모듈 경계가 되어 직접 가져오는 모듈도 클라이언트 번들에 포함된다. 서버 전용 코드와 비밀키를 사용할 수 없고, 해당 페이지에서 `metadata`·`generateMetadata`를 내보내는 구조도 사용할 수 없다. 이번에는 페이지를 Server Component로 유지하고 필요한 화면 컴포넌트만 분리했다. Client Provider에 서버에서 만든 `children`을 전달한다고 그 자식까지 모두 Client Component가 되는 것은 아니다.

## 렌더링 방식

**Client Component는 브라우저에서만 렌더링될까요?**

아니다. 첫 진입 때 Client Component도 서버에서 초기 HTML을 만들 수 있고, 브라우저에서는 JavaScript로 이벤트를 연결하는 하이드레이션이 진행된다. 따라서 `"use client"`만 붙였다고 렌더링 중 `localStorage`를 안전하게 읽을 수 있는 것은 아니다. 이번에는 `skipHydration`으로 자동 복원을 미루고 `useEffect`에서 복원해 서버와 브라우저의 첫 화면을 맞췄다.

**SSR, SSG, ISR, ISSG는 어떤 관계인가요?**

| 용어 | 페이지 생성·갱신 시점 | 이번 구현과의 관계 |
| --- | --- | --- |
| SSR | 요청을 받은 뒤 서버에서 화면을 준비 | 목록·검색·동적 영화 상세의 빌드 표시가 `ƒ` |
| SSG | 빌드할 때 화면을 미리 생성 | `/about`의 빌드 표시가 `○` |
| ISR | 생성한 정적 페이지를 재빌드·배포 없이 다시 생성 | 정적 생성에 갱신 정책을 결합하는 개념. 이번 상세 페이지 전체에 ISR을 적용했다고 주장하지 않음 |
| ISSG | 자료에 따라 Incremental Static Site Generation 등의 뜻으로 사용 | Next.js가 공식 기능명으로 안내하는 ISR과 문맥이 겹칠 수 있다. SSR·SSG와 동등한 별도 렌더러로 외우기보다 해당 자료의 생성·갱신 시점을 확인 |

Server/Client는 **컴포넌트 실행 경계**, SSR/SSG는 **화면을 준비하는 시점**에 관한 구분이다. 서로 일대일로 대응하지 않는다. `fetch` 데이터의 300초 재검증과 브라우저 Query의 `staleTime`도 별도의 캐시 정책이다. 워크북 예제의 `◐`는 Cache Components 설정을 사용한 부분 사전 렌더링이며, 이번 앱은 해당 옵션을 켜지 않아 실제 빌드 결과의 `○`와 `ƒ`를 기준으로 기록했다.

## 구현에 함께 적용한 요소

- **`next/link`, `next/navigation`**: 링크 이동, `router.push`·`replace`, 현재 경로 표시. 검색어·페이지는 URL에서 복원한다.
- **`next/image`**: 크기·`sizes`와 TMDB `remotePatterns`를 설정했다. 이미지 누락·실패 시 대체 영역도 유지한다.
- **`next/font/local`**: 설치된 Geist 파일을 자체 호스팅하고 `display: swap`을 적용했다. 한글은 시스템 폰트로 폴백한다.
- **Metadata API**: 페이지별 제목, 설명과 영화 상세 Open Graph 정보를 서버에서 만든다.
- **Route Handler**: 브라우저는 `/api/tmdb/...`를 호출하고 실제 TMDB 토큰은 서버 전용 환경 변수에 둔다.

## 참고

- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js: Migrating from Vite](https://nextjs.org/docs/app/guides/migrating/from-vite)
- [Next.js: Incremental Static Regeneration](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Next.js: generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js: Image](https://nextjs.org/docs/app/api-reference/components/image)
