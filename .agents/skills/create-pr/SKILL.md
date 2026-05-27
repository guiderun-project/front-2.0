---
name: create-pr
description: 현재 브랜치 변경 사항을 분석해 GitHub PR 을 한국어로 생성합니다. 사용자가 "PR 만들어줘", "PR 올려줘", "create PR" 등의 요청을 할 때 사용하세요.
---

# Create PR (guiderun-front-v2)

현재 브랜치를 base 브랜치 대비 분석해서 GitHub PR 을 생성하는 스킬.

## 전제
- `gh` CLI 가 인증된 상태여야 함 (`gh auth status` 로 확인)
- 작업 디렉토리가 git 저장소여야 함

## 절차

### 1. 사전 점검
```bash
git status                                    # uncommitted 변경 여부
git rev-parse --abbrev-ref HEAD               # 현재 브랜치
gh repo view --json defaultBranchRef -q .defaultBranchRef.name  # base 브랜치
git log --oneline {base}..HEAD                # 커밋 수
```
- 현재 브랜치가 `main` / `master` / `develop` 이면 거부하고 사용자에게 알림
- 커밋이 0 개면 거부
- uncommitted 변경이 있으면 사용자 확인 후 진행

### 2. 원격 푸시
원격에 브랜치가 없으면:
```bash
git push -u origin HEAD
```

### 3. 변경 분석
```bash
git diff {base}...HEAD --stat   # 파일 개요
git diff {base}...HEAD          # 전체 diff
```
- 변경 파일 맥락 필요 시 직접 파일 읽어서 확인
- 커밋 메시지·브랜치명에서 의도 추론

### 4. PR 생성
`gh pr create` 호출. 옵션:
- `--base {default-branch}`
- `--title` : Conventional commit 스타일 권장 (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:` 등), 70자 이내
- `--body` : 아래 템플릿. 비어있는 섹션은 출력하지 말 것
- 사용자가 draft 요청했으면 `--draft` 추가

#### Body 템플릿 (한국어, GFM)
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

#### Body 는 반드시 HEREDOC 으로
```bash
gh pr create --base main --title "..." --body "$(cat <<'EOF'
## 변경 사항
- ...
EOF
)"
```

### 5. 마무리
- 생성된 PR URL 을 사용자에게 출력
- PR 이 열리면 GitHub Actions 의 Claude PR Description / Review 워크플로가 자동으로 동작함을 알릴 것

## 규칙
- 본문은 한국어
- 시간 추정치 금지
- 추측 금지. diff·파일에서 확인되는 사실만 기술
- 칭찬·감탄사·이모지 남용 금지
- "이 PR 은 ~를 해결합니다" 같은 의역 대신 무엇이 바뀌었는지 사실 위주로
