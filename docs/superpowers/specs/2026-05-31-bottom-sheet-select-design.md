# BottomSheet Select Design

## Context

The app already has shared `BottomSheet`, `CheckBox`, `Icon`, `IconButton`, and `Text` components. There is not yet a shared Select, InputField, Chip, or Button component. The new selection UI should therefore stay focused on the BottomSheet selection workflow instead of introducing broader form primitives too early.

Figma references:

- `3061:11272`: field-like trigger that opens the sheet and displays the selected value.
- `2821:13807`: BottomSheet with a check-list selection body.
- `2751:13081`: BottomSheet variant with a footer CTA.
- `2171:6227`: compact chip-like trigger that can also open the same sheet.

## Goal

Create a reusable BottomSheet-backed select flow that supports both default field-style triggers and custom triggers. It should allow options to be selected inside a BottomSheet, show the selected value in the trigger, and optionally require an explicit confirmation before committing the selection.

## Scope

Implement two focused shared components:

- `BottomSheetCheckList`: renders selectable options inside an existing BottomSheet.
- `BottomSheetSelect`: composes a trigger, BottomSheet, `BottomSheetCheckList`, and optional confirmation footer.

Do not introduce shared `InputField`, `Chip`, or `Button` components as part of this work. The field-style trigger and footer button can be component-local to `BottomSheetSelect` until broader reuse is proven.

## Component Responsibilities

### BottomSheetCheckList

`BottomSheetCheckList` is a controlled option list. It receives options, the currently selected value, and an option selection callback.

Each option supports:

- `value`: stable string value.
- `label`: primary display text.
- `description`: optional secondary text.
- `disabled`: optional disabled state.

Visual behavior follows the Figma check-list:

- Selected rows use `theme.color.bg['brand-soft']`.
- Selected labels use `body-l-sb`; default labels use `body-l-m`.
- Descriptions use `body-s-m` and `text.secondary`.
- A selected row shows the `check-lined` icon in a 32px visual slot.
- Rows use full-width button semantics with visible focus states.

### BottomSheetSelect

`BottomSheetSelect` owns the open state by default and supports controlled selection through `value` and `onChange`.

It provides:

- A default field trigger matching the Figma input-field style.
- A `renderTrigger` slot for custom triggers such as status chips.
- A `sheetTitle` passed to `BottomSheet` as `topBarTitle`.
- A `confirmable` mode for explicit confirmation.
- Optional `confirmText`, defaulting to `확인`.
- Pass-through close behavior controls for `BottomSheet`, such as backdrop and escape close disabling.

## Selection Behavior

When `confirmable` is false:

- Clicking an enabled option immediately calls `onChange(nextValue)`.
- The BottomSheet closes immediately after selection.

When `confirmable` is true:

- Opening the sheet initializes a pending value from the committed `value`.
- Clicking an enabled option updates only the pending value.
- Clicking the confirmation button calls `onChange(pendingValue)` and closes the BottomSheet.
- Clicking the close button, backdrop, or Esc closes the BottomSheet and discards the pending value.
- Reopening the sheet starts again from the committed `value`.

The confirmation button should be disabled unless the pending value is different from the committed value. If no committed value exists, selecting any enabled option activates the button.

## Accessibility

- The default trigger is a `button`, not a read-only input, because it opens a dialog rather than editing text.
- The trigger exposes an accessible name from `label` or `aria-label`.
- The BottomSheet keeps its existing dialog semantics.
- Options are rendered as buttons with `aria-pressed` or equivalent selected-state exposure.
- Disabled options are not selectable and are announced as disabled.
- Focus states use existing `theme.color.border.focused` patterns.

## Styling

Use Emotion styled APIs and existing theme tokens. Do not use Tailwind or raw Figma CSS output.

Token mapping:

- Trigger border: `theme.color.border.default`
- Trigger placeholder: `theme.color.text.tertiary`
- Trigger selected text: `theme.color.text.primary`
- Trigger radius: `theme.radius.md`
- Trigger typography: `theme.typography['heading-s-m']`
- Check-list selected background: `theme.color.bg['brand-soft']`
- Check icon color: `theme.color.icon.brand`
- Footer button height: 54px via `theme.pxToRem(54)`

## Example Usage

```tsx
<BottomSheetSelect
  confirmable
  label="모임 운영방식"
  placeholder="모임 운영방식"
  sheetTitle="모임 운영방식"
  value={operationType}
  options={[
    { value: 'basic', label: '기본 훈련' },
    {
      value: 'group',
      label: '그룹별 훈련',
      description: '대회준비 그룹과 기초보강 그룹으로 나뉘어요',
    },
  ]}
  onChange={setOperationType}
/>
```

```tsx
<BottomSheetSelect
  confirmable
  sheetTitle="모집 상태"
  value={status}
  options={statusOptions}
  renderTrigger={({ open, selectedOption }) => (
    <StatusChip type="button" onClick={open}>
      {selectedOption?.label ?? '모집중'}
    </StatusChip>
  )}
  onChange={setStatus}
/>
```

## Validation

Implementation should update the shared component exports and add examples to `HomePage`. Before finishing implementation, run:

- `pnpm lint`
- `pnpm build`

