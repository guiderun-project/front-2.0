---
name: sync-figma-tokens
description: Compare the Guiderun design system Figma Variables and Styles against this React app's style token source files, then update local code tokens to match Figma. Use when asked to sync, compare, audit, or update Figma tokens, design tokens, style tokens, theme tokens, color variables, typography styles, spacing/radius tokens, effects, or gradients for guiderun-front-v2.
---

# Sync Figma Tokens

Use this skill to treat the Guiderun Figma design system as the source of truth for local style tokens in `src/styles/tokens`.

## Scope

Sync these token families:
- Spacing and radius: `src/styles/tokens/size.ts`
- Font family and weight: `src/styles/tokens/font.ts`
- Typography: `src/styles/tokens/typography.ts`
- Colors: `src/styles/tokens/color.ts`
- Effects: `src/styles/tokens/effect.ts`
- Gradients: `src/styles/tokens/gradient.ts` when requested

Read [references/guiderun-token-sync.md](references/guiderun-token-sync.md) before doing a full comparison or update.

## Language

Communicate with the user in Korean. Keep progress updates, approval requests, summaries, and final responses in Korean. Preserve code, token names, file paths, commands, and Figma variable/style names exactly as written.

## Workflow

1. Inspect local token files before editing.
   - Use `rg --files src/styles/tokens`.
   - Read the relevant token files and nearby call sites if tokens may be removed or renamed.

2. Export Figma variables and styles.
   - Use the Figma MCP/plugin tools for the design file in the reference.
   - Prefer `use_figma` with the Plugin API for complete local variables/styles because selection-dependent variable helpers may fail.
   - Export collections, variables, text styles, paint styles, and effect styles.

3. Normalize before comparing.
   - Convert Figma slash names to code dot paths for color tokens, for example `bg/overlay` -> `bg.overlay`.
   - Treat Figma `#RRGGBBAA` and code `rgba(...)` as equivalent when channel values match.
   - Treat px values and code rem values as equivalent with `16px = 1rem`.
   - Treat Figma line-height/letter-spacing percentages as code ratios/em values.

4. Update code tokens to Figma.
   - Figma values win for tokens that already correspond to Figma variables/styles.
   - Remove code-only tokens when unused.
   - If a code-only token is used, classify usage first: demo/example, temporary placeholder, product UI, or shared component API.
   - Never remove or replace a used code-only token without explicit user approval, even when usage looks demo/example-only.
   - Report the token, usage locations, and recommended Figma semantic replacement before asking for approval.
   - Prefer semantic tokens in components. Do not introduce raw colors in components.

5. Verify after editing.
   - Run `rg` for removed token names.
   - Run `pnpm lint`.
   - Run `pnpm build`.
   - If Figma comparison was requested, summarize what matches and list any remaining differences.
