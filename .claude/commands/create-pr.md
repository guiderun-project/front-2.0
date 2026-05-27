---
description: 현재 브랜치 변경 사항을 분석해 GitHub PR 을 생성합니다 (한국어 본문).
allowed-tools: Bash(git *), Bash(gh *), Read, Grep, Glob
---

# Create PR

현재 브랜치를 base 브랜치(main 또는 develop) 대비 분석해서 GitHub PR 을 생성한다.

## 사전 점검
1. `git status` 로 untracked / staged / unstaged 확인. uncommitted 변경이 있으면 사용자에게 알리고 진행 여부 확인.
2. `git rev-parse --abbrev-ref HEAD` 로 현재 브랜치 확인. `main`/`master`/`develop` 이면 거부.
3. `gh repo view --json defaultBranchRef -q .defaultBranchRef.name` 으로 base 브랜치 결정.
4. `git log --oneline {base}..HEAD` 로 커밋 수 확인. 0 이면 거부.
5. 원격에 브랜치 없으면 `git push -u origin HEAD` 로 push.

## 분석
- `git diff {base}...HEAD --stat` 으로 변경 파일 개요
- `git diff {base}...HEAD` 로 실제 diff
- 변경 파일 맥락 필요 시 Read / Grep 으로 확인
- 커밋 메시지·브랜치명에서 의도 추론

## PR 생성
`gh pr create` 로 생성. 옵션:
- `--base {default-branch}`
- `--title` : 브랜치명 또는 가장 의미있는 커밋에서 도출. Conventional commit 스타일 권장 (`feat:`, `fix:`, `chore:`, `refactor:` 등). 70자 이내.
- `--body` : 아래 템플릿 (한국어, GitHub Flavored Markdown). 비어있는 섹션은 출력하지 말 것.

## Body 템플릿
```
## 변경 사항
- <도메인/레이어별로 무엇이 추가·수정·삭제됐는지 bullet 3~6개>

## 변경 이유
- <왜 이 변경이 필요한지. 커밋·브랜치명에서 추론>

## 주요 구현 포인트
- <설계 결정·트레이드오프·주의 깊게 본 부분>

## 영향 범위
- <영향받는 라우트, API, 컴포넌트, 빌드 등>

## 체크리스트
- [ ] 빌드/lint 통과 (`pnpm build`, `pnpm lint`)
- [ ] MSW 핸들러 영향 확인
- [ ] 새 환경변수 (`.env.example`) 반영
```

## 규칙
- 본문은 한국어
- 시간 추정치(예: "5분이면 끝") 금지
- 추측 금지. diff·파일에서 확인되는 사실만 기술
- 칭찬·감탄사·이모지 남용 금지
- `gh pr create` 호출 시 `--body` 는 HEREDOC 으로 전달

## 마무리
- 생성된 PR URL 을 사용자에게 출력
- draft 로 만들어달라는 요청이 있었으면 `--draft` 추가
