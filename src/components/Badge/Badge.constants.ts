import type { ColorToken, TypographyToken, spacing } from '@/styles/tokens';

export const DEFAULT_BADGE_SIZE = 's';
export const DEFAULT_BADGE_VARIANT = 'soft';
export const DEFAULT_BADGE_TONE = 'gray';

export const BADGE_SIZE_STYLES = {
  s: {
    font: 'detail-s-sb',
    minHeight: 20,
    paddingX: 's',
  },
  m: {
    font: 'detail-m-m',
    minHeight: 23,
    paddingX: 'sm',
  },
} as const satisfies Record<
  string,
  {
    font: TypographyToken;
    minHeight: number;
    paddingX: keyof typeof spacing;
  }
>;

export const BADGE_COLOR_STYLES = {
  soft: {
    gray: {
      background: 'badge.bg.gray',
      text: 'badge.text.gray',
    },
    orange: {
      background: 'badge.bg.orange',
      text: 'badge.text.orange',
    },
    blue: {
      background: 'badge.bg.blue',
      text: 'badge.text.blue',
    },
    violet: {
      background: 'badge.bg.violet',
      text: 'badge.text.violet',
    },
    green: {
      background: 'badge.bg.green',
      text: 'badge.text.green',
    },
    cyan: {
      background: 'badge.bg.cyan',
      text: 'badge.text.cyan',
    },
    cyan2: {
      background: 'badge.bg.cyan',
      text: 'badge.text.cyan_2',
    },
  },
  solid: {
    gray: {
      background: 'badge.bg.solid-gray',
      text: 'badge.text.primitive',
    },
    cyan: {
      background: 'badge.bg.solid-cyan',
      text: 'badge.text.primitive',
    },
  },
} as const satisfies Record<string, Record<string, { background: ColorToken; text: ColorToken }>>;
