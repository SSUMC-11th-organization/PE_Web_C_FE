# UMCine · 7주차

회원가입 API 실습과 로그인·내 정보 조회·수정 화면을 구현했습니다. 기존 영화 조회, 검색, 북마크, TanStack Query 기능은 6주차에서 복사해 유지하고, 이전 주차 파일은 수정하지 않았습니다.

## 실행

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
# .env.local의 TMDB Read Access Token과 VITE_API_BASE_URL 설정
pnpm dev --host 127.0.0.1 --port 5179 --strictPort
```

`.env.local`이 이미 있다면 덮어쓰지 말고 `VITE_API_BASE_URL`만 추가하세요. 기본 회원 서버 주소는 워크북의 `http://localhost:8080`입니다. 기존 로컬 NestJS 6주차 회원 서버를 사용할 때는 `http://127.0.0.1:3004`로 설정합니다. 회원 서버가 없더라도 화면 퍼블리싱은 확인할 수 있으며 중복 확인·회원가입은 연결 실패를 안내합니다. TMDB 토큰은 영화 조회에만 필요합니다.

로컬 회원 서버를 함께 실행할 경우, 백엔드의 CORS 허용 목록에 프론트엔드 주소를 넣어야 합니다. 현재 작업 환경에서는 다음 명령으로 실행했습니다. DB 초기화나 테이블 삭제는 필요하지 않습니다.

```bash
cd /Users/imingyu/UMC\ 11th/PE_Web_C_BE-week6-prep/dominic/Week6/Week6_Mission
CORS_ORIGINS=http://127.0.0.1:5179,http://localhost:5179 npm start
```

## 화면과 범위

| 주소 | 구현 |
| --- | --- |
| `/signup` | 입력 검증, 이메일·닉네임 중복 확인, 실제 회원가입 API, 진행·성공·실패 안내 |
| `/login` | 이메일·비밀번호 입력, 유효성에 따른 버튼 상태, 회원가입 이동. 로그인 API는 다음 주차 |
| `/my` | 예시 기본 정보, 실제 북마크 영화 목록, 정보 수정 이동 |
| `/my/edit` | 닉네임·이메일·이미지 미리보기 및 수정/취소. 비밀번호 변경·회원 탈퇴·수정 중복 확인은 준비 중 안내 |

내 정보는 예시 데이터를 메모리에만 반영합니다. 새로고침하면 초기화되고 서버의 실제 계정은 수정되지 않습니다. 이미지도 서버로 전송하지 않습니다. 조회·수정 페이지를 `pages/my`에 묶었으며, 전용 layout이나 로그인 여부에 따른 접근 제한은 만들지 않았습니다. 기존 공통 Header/Footer만 사용합니다.

## 회원 API 계약

| 요청 | 응답 |
| --- | --- |
| `GET /members/email/:email` | `{ available: boolean }` 또는 `{ isSuccess: true, result: { available: boolean } }` |
| `GET /members/nickname/:nickname` | 동일한 가용 여부 응답 |
| `POST /members` | `{ isSuccess: true, message, result: { memberId, email, nickname } }` |

가입 요청에는 `email`, `nickname`, `password`만 보냅니다. 닉네임은 2~12자, 비밀번호는 영문 대·소문자·숫자·특수문자 `!@#$%^&*`를 포함한 8~72자입니다. 입력을 바꾸면 해당 중복 확인을 다시 해야 합니다. 요청은 자동 재시도하지 않으며 실패 시 입력을 유지한 채 두 중복 확인 후 재시도할 수 있습니다. HTTP 오류뿐 아니라 `isSuccess: false`와 응답 형식 오류도 성공으로 취급하지 않습니다.

## 확인

```bash
pnpm fix
pnpm check
pnpm lint
pnpm test
pnpm build  # 라우트 생성 및 TypeScript 타입 검사 포함
```

[미션 기록](mission-record.md), [핵심 키워드](../core-keywords.md), [워크북](https://makeus-challenge.notion.site/7-9ffb57f4596b8253bc970132cd86533e), [Figma](https://www.figma.com/design/erFuXxEy5svB8Be5gjIqdu?node-id=42-2731).
