import type { CSSProperties } from 'react';

import { fontFamily, fontWeight } from './font';

type TypographyStyle = {
  fontFamily: CSSProperties['fontFamily'];
  fontWeight: CSSProperties['fontWeight'];
  fontSize: CSSProperties['fontSize'];
  lineHeight: CSSProperties['lineHeight'];
  letterSpacing: CSSProperties['letterSpacing'];
};

export const typography = {
  'display-l': {
    fontFamily: fontFamily.april16th,
    fontWeight: fontWeight.promise,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.018em',
  },
  'heading-l-b': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.bold,
    fontSize: '1.75rem',
    lineHeight: 1.36,
    letterSpacing: '-0.018em',
  },
  'heading-l-sb': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.semibold,
    fontSize: '1.75rem',
    lineHeight: 1.36,
    letterSpacing: '-0.018em',
  },
  'heading-m-b': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.bold,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
  },
  'heading-m-sb': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.semibold,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
  },
  'heading-m-m': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.medium,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
  },
  'heading-m-r': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.regular,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
  },
  'heading-s-sb': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.semibold,
    fontSize: '1.25rem',
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
  },
  'heading-s-m': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.medium,
    fontSize: '1.25rem',
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
  },
  'body-l-b': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.bold,
    fontSize: '1.125rem',
    lineHeight: 1.48,
    letterSpacing: '-0.022em',
  },
  'body-l-sb': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.semibold,
    fontSize: '1.125rem',
    lineHeight: 1.48,
    letterSpacing: '-0.022em',
  },
  'body-m-sb': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.semibold,
    fontSize: '1rem',
    lineHeight: 1.48,
    letterSpacing: '-0.022em',
  },
  'body-m-m': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.medium,
    fontSize: '1rem',
    lineHeight: 1.48,
    letterSpacing: '-0.022em',
  },
  'body-s-sb': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.semibold,
    fontSize: '0.875rem',
    lineHeight: 1.48,
    letterSpacing: '-0.022em',
  },
  'body-s-m': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.medium,
    fontSize: '0.875rem',
    lineHeight: 1.48,
    letterSpacing: '-0.022em',
  },
  'body-s-r': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.regular,
    fontSize: '0.875rem',
    lineHeight: 1.48,
    letterSpacing: '-0.022em',
  },
  'detail-m-sb': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.semibold,
    fontSize: '0.875rem',
    lineHeight: 1.36,
    letterSpacing: '-0.022em',
  },
  'detail-m-m': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.medium,
    fontSize: '0.875rem',
    lineHeight: 1.36,
    letterSpacing: '-0.022em',
  },
  'detail-m-r': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.regular,
    fontSize: '0.875rem',
    lineHeight: 1.36,
    letterSpacing: '-0.022em',
  },
  'detail-s-sb': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.semibold,
    fontSize: '0.75rem',
    lineHeight: 1.32,
    letterSpacing: '-0.022em',
  },
  'detail-s-r': {
    fontFamily: fontFamily.pretendard,
    fontWeight: fontWeight.regular,
    fontSize: '0.75rem',
    lineHeight: 1.32,
    letterSpacing: '-0.022em',
  },
} as const satisfies Record<string, TypographyStyle>;

export type TypographyToken = keyof typeof typography;

