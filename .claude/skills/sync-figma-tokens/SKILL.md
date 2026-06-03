---
name: sync-figma-tokens
description: Figma Variables/Styles 를 기준으로 guiderun-front-v2 의 src/styles/tokens 값을 비교하고 업데이트합니다. Figma 토큰, design token, style token, theme token, color variable, typography style, spacing/radius/effect/gradient 동기화 요청에 사용하세요.
allowed-tools: Bash(rg *), Bash(sed *), Bash(git *), Bash(pnpm lint), Bash(pnpm build), Bash(pnpm *), Read, Grep, Glob, Edit, MultiEdit
---

# Sync Figma Tokens

이 스킬은 Guiderun Figma design system 을 source of truth 로 보고 로컬 style token 을 맞출 때 사용한다.

## 범위

- Spacing / Radius: `src/styles/tokens/size.ts`
- Font family / Weight: `src/styles/tokens/font.ts`
- Typography: `src/styles/tokens/typography.ts`
- Color primitive / semantic: `src/styles/tokens/color.ts`
- Effect: `src/styles/tokens/effect.ts`
- Gradient: `src/styles/tokens/gradient.ts` (`gradient` 정리를 명시적으로 요청한 경우)

상세 기준은 [references/guiderun-token-sync.md](references/guiderun-token-sync.md)를 먼저 읽는다.

## 언어

사용자와의 모든 진행 상황 공유, 승인 요청, 요약, 최종 답변은 한국어로 작성한다. 코드, 토큰명, 파일 경로, 명령어, Figma variable/style 이름은 원문 그대로 유지한다.

## 절차

1. 로컬 토큰 구조를 먼저 확인한다.
   - `rg --files src/styles/tokens`
   - 관련 파일과 제거/rename 대상 토큰의 call site 를 읽는다.

2. Figma Variables / Styles 를 추출한다.
   - Figma MCP 또는 Claude 환경에 연결된 Figma 도구를 사용한다.
   - selection 기반 variable helper 가 실패하면 Figma Plugin API 방식으로 local variables/styles 를 조회한다.
   - collections, variables, text styles, paint styles, effect styles 를 모두 확인한다.

3. 비교 전에 normalize 한다.
   - Figma slash path: `bg/overlay`
   - 코드 token path: `bg.overlay`
   - Figma `#RRGGBBAA` 와 코드 `rgba(...)`는 채널 값이 같으면 동일하게 본다.
   - px/rem 변환 기준은 `16px = 1rem`.
   - Figma line-height/letter-spacing 퍼센트는 코드 ratio/em 값과 비교한다.

4. Figma 기준으로 코드 토큰을 업데이트한다.
   - 이미 Figma 변수/스타일에 대응되는 토큰은 Figma 값이 우선이다.
   - 코드에만 있는 토큰은 사용처를 확인한다.
   - 미사용 code-only 토큰은 삭제한다.
   - 사용 중인 code-only 토큰은 먼저 사용처를 demo/example, temporary placeholder, product UI, shared component API 로 분류한다.
   - 사용처가 하나라도 있는 code-only 토큰은 demo/example-only 처럼 보여도 명시적 사용자 승인 없이 삭제하거나 대체하지 않는다.
   - 승인 요청 전 토큰명, 사용 위치, 추천 Figma semantic 대체 토큰을 보고한다.
   - 컴포넌트에는 raw color 를 추가하지 말고 semantic token 을 사용한다.

5. 검증한다.
   - 삭제/rename 한 토큰명이 남았는지 `rg`로 확인한다.
   - `pnpm lint`
   - `pnpm build`
   - 커밋 전이라면 `git diff --check`
