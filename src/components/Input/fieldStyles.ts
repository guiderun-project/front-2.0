import type { Theme } from '@emotion/react';

import type { TypographyToken } from '@/styles/tokens';

export const LABEL_TYPOGRAPHY = 'heading-s-m' satisfies TypographyToken;
const MULTILINE_VALUE_TYPOGRAPHY = 'body-m-m' satisfies TypographyToken;
export const INFO_TYPOGRAPHY = 'detail-m-m' satisfies TypographyToken;
export const COUNTER_TOTAL_TYPOGRAPHY = 'detail-m-r' satisfies TypographyToken;

export const FIELD_MIN_HEIGHT = 74;
export const MULTILINE_FIELD_MIN_HEIGHT = 124;
export const CONTROL_TOP_SPACE = 23;
export const CLEAR_ICON_SIZE = 24;
export const DEFAULT_CLEAR_LABEL = '입력 내용 지우기';
const CARET_BAR_OFFSET = 6;
export const CARET_BAR_WIDTH = 2;
export const CARET_BAR_HEIGHT = 18;
export const MULTILINE_CARET_BAR_HEIGHT = 18;

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
    caretColor: theme.color.text.brand,
    '&[aria-invalid="true"]': {
      caretColor: theme.color.text.danger,
    },
    '&:placeholder-shown': {
      caretColor: 'transparent',
    },
    ...typographyStyle(theme, multiline ? MULTILINE_VALUE_TYPOGRAPHY : LABEL_TYPOGRAPHY),

    // Offset the placeholder so it does not sit flush against the focus caret
    // bar. Applies to both single-line and multiline: the bar only shows while
    // the field is empty and focused, which is exactly the placeholder-shown
    // state, and on a textarea text-indent only shifts that first line.
    '&:focus:placeholder-shown': {
      textIndent: theme.pxToRem(CARET_BAR_OFFSET),
    },

    ...(multiline
      ? ({
          resize: 'none',
          minHeight: theme.pxToRem(28),
          overflow: 'hidden',
        } as const)
      : {}),

    '&::placeholder': {
      color: theme.color.text.tertiary,
    },

    '&:not(:focus)::placeholder': {
      color: 'transparent',
    },

    '&:disabled': {
      color: theme.color.text.disabled,
      cursor: 'not-allowed',
      WebkitTextFillColor: theme.color.text.disabled,
    },
  }) as const;
