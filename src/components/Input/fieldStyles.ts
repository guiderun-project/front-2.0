import type { Theme } from '@emotion/react';

import type { TypographyToken } from '@/styles/tokens';

/** Floating label / single-line field value typography (20px). */
export const LABEL_TYPOGRAPHY = 'heading-s-m' satisfies TypographyToken;
/** Multi-line field value typography (16px). */
export const MULTILINE_VALUE_TYPOGRAPHY = 'body-m-m' satisfies TypographyToken;
/** Helper, error, and counter "current" typography (14px medium). */
export const INFO_TYPOGRAPHY = 'detail-m-m' satisfies TypographyToken;
/** Counter "total" typography (14px regular). */
export const COUNTER_TOTAL_TYPOGRAPHY = 'detail-m-r' satisfies TypographyToken;

export const FIELD_MIN_HEIGHT = 74;
export const MULTILINE_FIELD_MIN_HEIGHT = 124;
/** Vertical room reserved above the control so the floated label clears the value. */
export const CONTROL_TOP_SPACE = 20;
export const FLOATED_LABEL_SCALE = 0.7;
export const CLEAR_ICON_SIZE = 24;
export const DEFAULT_CLEAR_LABEL = '입력 내용 지우기';
/** Brand bar (2px) + gap (4px) reserved before the placeholder when focused. */
export const CARET_BAR_OFFSET = 6;
export const CARET_BAR_WIDTH = 2;
export const CARET_BAR_HEIGHT = 18;

export const typographyStyle = (theme: Theme, token: TypographyToken) => {
  const value = theme.typography[token];

  return {
    fontFamily: value.fontFamily,
    fontSize: value.fontSize,
    fontWeight: value.fontWeight,
    letterSpacing: value.letterSpacing,
    lineHeight: value.lineHeight,
  };
};

/**
 * Shared visual styles for the editable control. `Input`/`Textarea`/`TimerInput`
 * apply these to their own `input`/`textarea` element so the typography and
 * floating-label spacing stay consistent across the family.
 *
 * `multiline` switches to the textarea value typography (16px) and the
 * auto-growing layout used by `Textarea`.
 */
export const fieldControlStyles = (theme: Theme, multiline = false) =>
  ({
    display: 'block',
    width: '100%',
    margin: 0,
    padding: 0,
    paddingTop: theme.pxToRem(CONTROL_TOP_SPACE),
    border: 0,
    outline: 'none',
    background: 'transparent',
    color: theme.color.text.primary,
    // Brand-coloured text caret once the user is typing. While the field is
    // empty the native caret is hidden and the shell shows a solid brand bar
    // before the placeholder instead (see InputFieldShell `Caret`), matching the
    // design's focused state.
    caretColor: theme.color.text.brand,
    '&:placeholder-shown': {
      caretColor: 'transparent',
    },
    ...typographyStyle(theme, multiline ? MULTILINE_VALUE_TYPOGRAPHY : LABEL_TYPOGRAPHY),

    // Single-line: make room for the brand bar + gap shown before the
    // placeholder while focused and empty.
    ...(multiline
      ? {}
      : {
          '&:focus:placeholder-shown': {
            textIndent: theme.pxToRem(CARET_BAR_OFFSET),
          },
        }),

    ...(multiline
      ? ({
          resize: 'none',
          // Auto-grows from JS, but keep a sensible minimum so a single row
          // never collapses below the design's content area.
          minHeight: theme.pxToRem(28),
          overflow: 'hidden',
        } as const)
      : {}),

    '&::placeholder': {
      color: theme.color.text.tertiary,
    },

    // The resting label sits over the empty field, so the placeholder must stay
    // hidden until the field is focused (and the label floats up). This matches
    // the design: placeholder text only appears in the focused state.
    '&:not(:focus)::placeholder': {
      color: 'transparent',
    },

    '&:disabled': {
      color: theme.color.text.disabled,
      cursor: 'not-allowed',
      WebkitTextFillColor: theme.color.text.disabled,
    },
  }) as const;
