# 🌐 Web C

SSUMC 11기 Web 스터디 C조

## 👥 Member

| 도미닉 | 셰리 | 무니 | 오달수 |
| :---: | :---: | :---: | :---: |
| [이민규](https://github.com/MinGyuLee2) | [최민식](https://github.com/sik2-da) | [문수현](https://github.com/msuhyun) | [양태건](https://github.com/Taegeon-Yang) |

<br/>

## ⭐️ 스터디 규칙

✅ 워크북 노션 채우기 <br />
✅ 스터디 전까지 해당 주차 PR 올리기

<br/>

## 🌳 branch 규칙

```bash
├─main
    ├─joja/main
    │  └─joja/#1
```

1. `닉네임/main 브랜치`가 기본 브랜치로 pr 보낼 때 root 브랜치(main 브랜치)가 아닌 닉네임/main 브랜치로 올립니다.
2. 매주 워크북, 실습, 그리고 미션은 각자의 닉네임/main 브랜치를 base 브랜치로 삼아 `닉네임/이슈번호 브랜치`를 생성하여 관련 파일을 업로드합니다.
3. 스터디원의 approve를 받으면, pr을 머지하고 해당 pr을 생성한 브랜치(닉네임/이슈번호 브랜치)는 삭제합니다. approve와 merge는 스터디 진행 중에 이루어집니다.

## 📂 디렉터리 규칙

```bash
├─닉네임
    ├─Week1
    │  └─미션이름
    │    ├─index.html
    │    ├─index.ts
    │    └─style.css
    ├─Week2
    │  └─Week2_Mission
```

<br/>

## 🔖 커밋 컨벤션

| Message  | 설명                |
| :------: | :------------------ |
| mission  | 미션 수행           |
| practice | 실습 수행           |
| workbook | 워크북 정리         |
| refactor | 코드 리팩토링       |
|   fix    | 버그 수정           |
|   docs   | 문서 수정           |
| comment  | 주석 추가 및 변경   |
|  remove  | 파일 혹은 폴더 삭제 |
|  chore   | 기타 변경사항       |

```bash
// 커밋 메시지
[week1/mission] 미션 제목
```
## 🚀 작업 순서

1. **이슈 확인**
   - 해당 주차 이슈를 확인합니다.

2. **원격과 자신의 브랜치 동기화**
   - `닉네임/main` 브랜치를 원격 기준으로 최신 상태로 유지합니다.

3. **브랜치 생성 후 코드 작업**
   - 아래 구조에 맞게 브랜치를 생성하고 작업합니다.
   - **구조:** `닉네임/main` → `닉네임/#이슈번호`

4. **Biome 체크**
   - PR 올리기 전 아래 명령어를 순서대로 실행합니다.
   ```bash
   pnpm fix        # lint/format 자동 수정
   pnpm check      # lint + format 검사
   pnpm typecheck  # TypeScript 타입 검사
   ```

5. **PR 올리기**
   - PR 템플릿에 맞게 작성하여 아래 방향으로 PR을 올립니다.
   - **방향:** `닉네임/main` ← `닉네임/#이슈번호`

6. **마감 기한**
   - 스터디 전날 23:59까지 제출을 완료해야 합니다.

## UMCine 실행

`pnpm install` 후 `pnpm dev`로 실행하고 http://localhost:3000 을 엽니다. 프로덕션은 `pnpm build` 후 `pnpm start`로 실행합니다.

루트의 `.env.local`에 `TMDB_API_BASE_URL`, `TMDB_ACCESS_TOKEN`, `API_BASE_URL`을 설정합니다. 기존 `VITE_` 접두사 이름도 지원합니다. 회원·평점·즐겨찾기 기능을 확인하려면 백엔드도 실행해야 합니다.
