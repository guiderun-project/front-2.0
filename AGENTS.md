# AGENTS.md — guiderun-front-v2

이 문서는 Codex CLI / 기타 AI 에이전트가 이 저장소에서 작업할 때 따라야 할
공통 컨텍스트와 규칙이다. (Claude Code 는 `.github/CLAUDE.md` 참조)

## 프로젝트 요약
React 19 + TypeScript + Vite 기반 SPA. v2 아키텍처 파운데이션
(라우터·API 클라이언트·MSW·전역 스타일) 단계이며 도메인 화면은 점진적으로 이식 중.

## 기술 스택
- **빌드**: Vite 7
- **언어**: TypeScript 5.9 (`strict`)
- **UI**: React 19, React Router DOM 7
- **스타일**: Emotion (`@emotion/react`, `@emotion/styled`)
- **서버 상태**: TanStack Query 5
- **HTTP**: Axios 1.13 — `publicApi` / `privateApi` 두 인스턴스, 401 시 `/oauth/login/reissue` 로 1회 재발급
- **목 서버**: MSW 2.12 (`VITE_ENABLE_MSW=true` 일 때만 활성)
- **패키지 매니저**: pnpm

## 디렉토리 규약
```
src/
  api/
    core/        # axios 인스턴스, 토큰 스토리지
    contracts/   # 요청/응답 타입
    services/    # 도메인별 API 호출 함수
  mocks/         # MSW worker + handlers
  pages/         # 라우트 컴포넌트
  router/        # path 상수, router 정의
  styles/        # 전역 스타일
```

## 코드 스타일 규약
- 페이지 파일은 **컴포넌트와 헬퍼 정의를 styled 컴포넌트 위에** 작성
- `@/` alias 로 `src/` 참조
- styled 컴포넌트는 **컴포넌트 함수 바깥**에서만 선언
- import 정렬: 외부 → 내부 (`@/`) 순, 그룹 사이 빈 줄

## 자주 점검할 잠재 이슈
1. `styled` 를 컴포넌트 내부에서 만드는 경우 (매 렌더 새 클래스)
2. `useEffect` 안의 axios 호출에 `AbortController` 미사용
3. context provider value 를 매 렌더 새 객체로 전달
4. 라우트 컴포넌트를 `React.lazy` 없이 동기 import
5. `useQuery` 기본 옵션 (`staleTime`, `gcTime`) 조정 누락

## 빌드/검증 명령
- `pnpm dev`
- `pnpm build` (`tsc -b && vite build`)
- `pnpm lint`

## 환경 변수
- `VITE_API_BASE_URL` (필수) — 미설정 시 부팅 실패
- `VITE_ENABLE_MSW` — `'true'` 일 때만 MSW 활성

## 작업 규칙
- 모든 사용자 응답·코멘트·PR 본문은 **한국어**
- 시간 추정치 금지
- 칭찬·감탄사 금지, 사실 기반으로만 작성
- 추측 금지 — diff·실제 코드 경로로 설명 가능한 것만
- 커밋 메시지: Conventional Commits 권장 (`feat:`, `fix:`, `chore:`, `refactor:` 등)

## 사용 가능한 스킬
- `.agents/skills/create-pr` — 현재 브랜치 변경 사항을 분석해 PR 생성

## CI 자동화
PR 을 열면 GitHub Actions 가 자동으로 동작한다:
- `claude-pr-description.yml` — PR description 한국어 자동 작성
- `claude-pr-review.yml` — React 렌더링 / 메모리 누수 / 번들 / Emotion 비용 4개 카테고리 한정 리뷰
