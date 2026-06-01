# Guiderun Token Sync Reference

## Figma Source

- Figma file: `01. Design System`
- URL: `https://www.figma.com/design/3mtpJ1qIot4ybUxY7ORDSv/01.-Design-System?node-id=2016-758&p=f&m=dev`
- fileKey: `3mtpJ1qIot4ybUxY7ORDSv`
- nodeId: `2016:758`

Expected local Figma collections:
- `Spacing`: 12 variables
- `Radius`: 7 variables
- `Font-family`: 2 variables
- `Font-weight`: 5 variables
- `Color / Primitive`: 68 variables
- `Color / Semantic`: 60 variables

Expected local Figma styles:
- Paint styles: 5
- Text styles: 22
- Effect styles: 2

## Local Code Files

- `src/styles/tokens/size.ts`: `spacing`, `radius`, `pxToRem`
- `src/styles/tokens/font.ts`: `fontFamily`, `fontWeight`
- `src/styles/tokens/typography.ts`: text style tokens
- `src/styles/tokens/color.ts`: primitive colors, semantic color aliases, CSS variable token maps
- `src/styles/tokens/effect.ts`: shadow tokens
- `src/styles/tokens/gradient.ts`: gradient CSS variable tokens and mode values
- `src/styles/theme.ts`: theme exposure
- `src/styles/emotion.d.ts`: Emotion theme typing if new fields are added

## Figma Export Pattern

Use `use_figma` and return compact JSON/string output. Selection-based variable tools may report "nothing selected".

Useful export outline:

```js
function hex(n){return Math.round(n*255).toString(16).padStart(2,'0').toUpperCase()}
function colorToHex(c){const base=`#${hex(c.r)}${hex(c.g)}${hex(c.b)}`; return typeof c.a==='number' && c.a<1 ? `${base}${hex(c.a)}` : base}
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const byId = new Map(variables.map(v => [v.id, v]));
function summarize(value) {
  if (value && value.type === 'VARIABLE_ALIAS') {
    const target = byId.get(value.id);
    return target ? target.name : value.id;
  }
  if (value && typeof value === 'object' && 'r' in value) return colorToHex(value);
  return value;
}
```

For semantic colors, report aliases by mode:

```js
const c = collections.find(c => c.name === 'Color / Semantic');
const modes = Object.fromEntries(c.modes.map(m => [m.name, m.modeId]));
const rows = variables
  .filter(v => v.variableCollectionId === c.id)
  .sort((a,b) => a.name.localeCompare(b.name))
  .map(v => `${v.name}=Light:${summarize(v.valuesByMode[modes.Light])}|Dark:${summarize(v.valuesByMode[modes.Dark])}`);
return rows.join('\\n');
```

## Normalization Rules

- Name conversion:
  - Figma color variable `a/b/c` maps to code token `a.b.c`.
  - Figma `profile/VI` may map to code `profile.vi`.
  - Figma `profile/Guide` may map to code `profile.guide`.
- Size conversion:
  - Figma float px maps to `pxToRem(px)` in code.
  - `16px = 1rem`.
- Typography conversion:
  - Figma `40` px maps to `2.5rem`.
  - Figma `lineHeight: 148%` maps to `lineHeight: 1.48`.
  - Figma `letterSpacing: -2.2%` maps to `letterSpacing: '-0.022em'`.
- Alpha color conversion:
  - `#333B461A` equals `rgba(51, 59, 70, 0.1)`.
  - `#FFFFFF14` equals `rgba(255, 255, 255, 0.08)`.
  - `#1218208A` equals `rgba(18, 24, 32, 0.54)`.

## Update Rules

- Communicate with the user in Korean. Approval requests and comparison summaries must be Korean.
- Preserve code, token names, Figma names, file paths, and commands in their original spelling.
- Keep `primitiveColorTokenMap` and `colorPrimitive` aligned with Figma primitive colors.
- Keep `semanticColorAliases.light` and `.dark` aligned with Figma semantic variable aliases.
- Keep `color` and `colorTokenMap` aligned with the final public semantic token set.
- Remove code-only semantic aliases only when unused.
- If a code-only token has any usage, do not remove or replace it without explicit user approval.
- For used code-only tokens, report the token, usage locations, and recommended Figma semantic replacement before asking for approval.
- Before removing a token, search exact usages:
  - `rg -n "['\\\"]token.name['\\\"]|theme\\.color\\....|color-token-name" src`
- After removing or renaming a token, re-run `rg` for the old name.

## Validation Commands

Run these before final response:

```bash
pnpm lint
pnpm build
```

Also run:

```bash
git diff --check
```

when making broad token edits or before committing.
