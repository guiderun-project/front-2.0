import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { ColorToken, TypographyToken, spacing } from '@/styles/tokens';

import type {
  BADGE_COLOR_STYLES,
  BADGE_SIZE_STYLES,
  DEFAULT_BADGE_VARIANT,
} from './Badge.constants';

export type BadgeSize = keyof typeof BADGE_SIZE_STYLES;
export type BadgeVariant = keyof typeof BADGE_COLOR_STYLES;
export type BadgeTone<TVariant extends BadgeVariant> = TVariant extends BadgeVariant
  ? keyof (typeof BADGE_COLOR_STYLES)[TVariant]
  : never;

export type BadgeBaseProps = {
  children: ReactNode;
  size?: BadgeSize;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'>;

export type BadgeProps<TVariant extends BadgeVariant = typeof DEFAULT_BADGE_VARIANT> =
  BadgeBaseProps & {
    variant?: TVariant;
    tone?: BadgeTone<TVariant>;
  };

export type BadgeColorStyle = {
  background: ColorToken;
  text: ColorToken;
};

export type BadgeStyleProps = {
  $background: ColorToken;
  $font: TypographyToken;
  $minHeight: number;
  $paddingX: keyof typeof spacing;
  $text: ColorToken;
};
