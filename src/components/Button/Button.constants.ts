import type { ColorToken, TypographyToken } from '@/styles/tokens';

import type { ButtonLevel, ButtonSize, ButtonStatus } from './Button.types';

type ButtonSizeStyle = {
  width?: number;
  height: number;
  minWidth?: number;
  paddingX: 'md' | 'xl';
  gap: 's' | 'sm';
  radius: 'sm' | 'md';
};

// 사이즈 무관 default 두께에, 사이즈별로 다른 값만 덮어쓴다
type ButtonBorderWidth = { default: number } & Partial<Record<ButtonSize, number>>;

type ButtonColorTokens = {
  background?: ColorToken;
  border?: {
    color: ColorToken;
    width: ButtonBorderWidth;
  };
  content: ColorToken;
};

export const BUTTON_SIZE_STYLES = {
  l: {
    width: 112,
    height: 54,
    paddingX: 'xl',
    gap: 'sm',
    radius: 'md',
  },
  m: {
    width: 84,
    height: 42,
    paddingX: 'xl',
    gap: 's',
    radius: 'md',
  },
  s: {
    height: 32,
    minWidth: 56,
    paddingX: 'md',
    gap: 's',
    radius: 'sm',
  },
} as const satisfies Record<ButtonSize, ButtonSizeStyle>;

export const BUTTON_ICON_SIZE = 14;

// 사이즈 기준 기본 타이포. size=l 은 primary 만 Bold(body-l-b) 로 예외 처리
export const BUTTON_TYPOGRAPHY: Record<ButtonSize, TypographyToken> = {
  l: 'body-l-sb',
  m: 'body-m-sb',
  s: 'detail-m-sb',
};

export const resolveButtonBorderWidth = (width: ButtonBorderWidth, size: ButtonSize): number =>
  width[size] ?? width.default;

export const BUTTON_COLOR_TOKENS: Record<ButtonLevel, Record<ButtonStatus, ButtonColorTokens>> = {
  primary: {
    default: {
      background: 'bg.brand-primary',
      content: 'text.inverse',
    },
    selected: {
      background: 'bg.brand-subtle',
      content: 'text.inverse',
    },
    pressed: {
      background: 'bg.brand-surface',
      content: 'text.inverse',
    },
    disabled: {
      background: 'bg.brand-soft2',
      content: 'text.inverse',
    },
  },
  secondary: {
    default: {
      background: 'bg.brand-soft',
      content: 'text.brand',
    },
    selected: {
      background: 'bg.brand-soft2',
      border: {
        color: 'text.brand',
        width: { default: 2 },
      },
      content: 'text.brand',
    },
    pressed: {
      background: 'bg.brand-soft2',
      content: 'text.brand-subtle',
    },
    disabled: {
      background: 'bg.surface',
      content: 'text.quaternary',
    },
  },
  'line-type': {
    default: {
      border: {
        color: 'border.default',
        width: { default: 1.4, l: 1.8 },
      },
      content: 'text.secondary',
    },
    selected: {
      border: {
        color: 'text.brand',
        width: { default: 2 },
      },
      content: 'text.brand',
    },
    pressed: {
      background: 'bg.surface',
      border: {
        color: 'border.subtle',
        width: { default: 2 },
      },
      content: 'text.secondary',
    },
    disabled: {
      background: 'bg.subtle',
      border: {
        color: 'border.subtle',
        width: { default: 1.4 },
      },
      content: 'text.quaternary',
    },
  },
  quaternary: {
    default: {
      background: 'bg.overlay',
      border: {
        color: 'border.subtle',
        width: { default: 1.2 },
      },
      content: 'text.secondary',
    },
    selected: {
      background: 'bg.overlay',
      border: {
        color: 'border.default',
        width: { default: 2, s: 1.4 },
      },
      content: 'text.secondary',
    },
    pressed: {
      background: 'bg.overlay',
      border: {
        color: 'border.default',
        width: { default: 2, s: 1.4 },
      },
      content: 'text.secondary',
    },
    disabled: {
      background: 'bg.overlay',
      content: 'text.quaternary',
    },
  },
};
