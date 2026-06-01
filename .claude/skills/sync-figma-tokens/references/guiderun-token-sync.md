# Guiderun Token Sync Reference

## Figma Source

- Figma file: `01. Design System`
- URL: `https://www.figma.com/design/3mtpJ1qIot4ybUxY7ORDSv/01.-Design-System?node-id=2016-758&p=f&m=dev`
- fileKey: `3mtpJ1qIot4ybUxY7ORDSv`
- nodeId: `2016:758`

Expected Figma variable collections:
- `Spacing`: 12
- `Radius`: 7
- `Font-family`: 2
- `Font-weight`: 5
- `Color / Primitive`: 68
- `Color / Semantic`: 60

Expected Figma styles:
- Paint styles: 5
- Text styles: 22
- Effect styles: 2

## Local Files

- `src/styles/tokens/size.ts`
- `src/styles/tokens/font.ts`
- `src/styles/tokens/typography.ts`
- `src/styles/tokens/color.ts`
- `src/styles/tokens/effect.ts`
- `src/styles/tokens/gradient.ts`
- `src/styles/theme.ts`
- `src/styles/emotion.d.ts`

## Figma Export Pattern

Figma selection-dependent helpers may fail with "nothing selected". Prefer a Plugin API style query when available.

```js
function hex(n) {
  return Math.round(n * 255).toString(16).padStart(2, '0').toUpperCase();
}

function colorToHex(c) {
  const base = `#${hex(c.r)}${hex(c.g)}${hex(c.b)}`;
  return typeof c.a === 'number' && c.a < 1 ? `${base}${hex(c.a)}` : base;
}

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const byId = new Map(variables.map((v) => [v.id, v]));

function summarize(value) {
  if (value && value.type === 'VARIABLE_ALIAS') {
    const target = byId.get(value.id);
    return target ? target.name : value.id;
  }
  if (value && typeof value === 'object' && 'r' in value) return colorToHex(value);
  return value;
}
```

Semantic color alias export:

```js
const c = collections.find((collection) => collection.name === 'Color / Semantic');
const modes = Object.fromEntries(c.modes.map((mode) => [mode.name, mode.modeId]));
const rows = variables
  .filter((variable) => variable.variableCollectionId === c.id)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((variable) => `${variable.name}=Light:${summarize(variable.valuesByMode[modes.Light])}|Dark:${summarize(variable.valuesByMode[modes.Dark])}`);

return rows.join('\n');
```

## Normalization

- `a/b/c` in Figma maps to `a.b.c` in code.
- `profile/VI` may map to `profile.vi`.
- `profile/Guide` may map to `profile.guide`.
- Figma px maps to code rem with `16px = 1rem`.
- `lineHeight: 148%` maps to `lineHeight: 1.48`.
- `letterSpacing: -2.2%` maps to `letterSpacing: '-0.022em'`.
- `#333B461A` equals `rgba(51, 59, 70, 0.1)`.
- `#FFFFFF14` equals `rgba(255, 255, 255, 0.08)`.
- `#1218208A` equals `rgba(18, 24, 32, 0.54)`.

## Update Rules

- Communicate with the user in Korean. Approval requests and comparison summaries must be Korean.
- Preserve code, token names, Figma names, file paths, and commands in their original spelling.
- Keep `colorPrimitive` and `primitiveColorTokenMap` aligned with Figma primitive colors.
- Keep `semanticColorAliases.light` and `semanticColorAliases.dark` aligned with Figma semantic aliases.
- Keep `color` and `colorTokenMap` aligned with the public semantic token set.
- Remove code-only semantic aliases only when unused.
- If a code-only token has any usage, do not remove or replace it without explicit user approval.
- For used code-only tokens, report the token, usage locations, and recommended Figma semantic replacement before asking for approval.
- Before deleting a token, search exact usage:

```bash
rg -n "['\"]token.name['\"]|theme\\.color|color-token-name" src
```

- After deleting or renaming, re-run `rg` for the old token name.

## Validation

```bash
git diff --check
pnpm lint
pnpm build
```
