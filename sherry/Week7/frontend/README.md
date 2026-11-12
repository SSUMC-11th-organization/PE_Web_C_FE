# Chapter07 · 인증 개념 이해와 회원가입 구현하기

## 실행 방법

```powershell
cd sherry/Week7/frontend
npm ci
Copy-Item .env.example .env.local
npm run dev -- --port 5173 --strictPort
```

Spring Boot 회원 서버는 별도로 `http://localhost:8080`에서 실행합니다.
환경변수 변경 후에는 개발 서버를 재시작합니다.

## 페이지와 구현 범위

- `/signup`: 입력 검증, 이메일·닉네임 중복 확인, 회원가입 API 연결, 요청 중 가입 버튼 비활성화, 성공·실패 메시지.
- `/login`: 이메일·비밀번호 입력과 제출 안내 화면. 로그인 API는 다음 주차 범위입니다.
- `/mypage`: 예시 프로필 조회 및 수정 화면. 저장은 React 상태에만 반영하며 새로고침하면 초기화됩니다.
- 기본 주소 `/`에는 페이지를 연결하지 않았으므로 `/signup` 등 위 경로로 접속합니다.
- `pages/auth`에 회원가입·로그인, `pages/member`에 내 정보 화면을 모았습니다. 인증 접근 제한은 구현하지 않았습니다.

## 회원 API

- `GET /members/email/{email}`
- `GET /members/nickname/{nickname}`
- `POST /members`: email, nickname, password 전송. passwordConfirm은 전송하지 않습니다.

로컬 서버와 DB 설정은 이 프론트엔드 제출물에 포함하지 않습니다.

## 확인한 동작

- 실제 회원가입 성공 후 같은 이메일이 중복으로 표시되는 것을 확인했습니다.
- 확인한 이메일 변경 시 가입 버튼이 비활성화됩니다.
- 서버 중지 시 중복 확인 실패 안내가 표시되고 입력값이 유지됩니다.
- 로그인 입력 및 내 정보 수정 후 화면 반영을 확인했습니다.

## 검사

```powershell
npm run build
npm run lint
```
