import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { resolveColorToken } from '@/styles/tokens';

import {
  BADGE_COLOR_STYLES,
  BADGE_SIZE_STYLES,
  DEFAULT_BADGE_SIZE,
  DEFAULT_BADGE_TONE,
  DEFAULT_BADGE_VARIANT,
} from './Badge.constants';
import type {
  BadgeColorStyle,
  BadgeProps,
  BadgeTone,
  BadgeVariant,
  BadgeStyleProps,
} from './Badge.types';

export const Badge = <TVariant extends BadgeVariant = typeof DEFAULT_BADGE_VARIANT,>({
  children,
  size = DEFAULT_BADGE_SIZE,
  tone,
  variant = DEFAULT_BADGE_VARIANT as TVariant,
  ...props
}: BadgeProps<TVariant>): ReactElement => {
  const sizeStyle = BADGE_SIZE_STYLES[size];
  const colorStyle = getBadgeColorStyle(variant, tone);

  return (
    <StyledBadge
      $background={colorStyle.background}
      $font={sizeStyle.font}
      $minHeight={sizeStyle.minHeight}
      $paddingX={sizeStyle.paddingX}
      $text={colorStyle.text}
      {...props}
    >
      {children}
    </StyledBadge>
  );
};

const getBadgeColorStyle = (
  variant: BadgeVariant,
  tone: BadgeTone<BadgeVariant> | undefined,
): BadgeColorStyle => {
  const variantStyles = BADGE_COLOR_STYLES[variant];
  const resolvedTone = tone && tone in variantStyles ? tone : DEFAULT_BADGE_TONE;

  return variantStyles[resolvedTone as keyof typeof variantStyles];
};

const StyledBadge = styled.span<BadgeStyleProps>(
  ({ $background, $font, $minHeight, $paddingX, $text, theme }) => {
    const typography = theme.typography[$font];

    return {
      alignItems: 'center',
      backgroundColor: resolveColorToken($background),
      borderRadius: theme.radius.s,
      color: resolveColorToken($text),
      display: 'inline-flex',
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      gap: theme.spacing.s,
      justifyContent: 'center',
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
      minHeight: theme.pxToRem($minHeight),
      overflowWrap: 'normal',
      padding: `${theme.spacing.xs} ${theme.spacing[$paddingX]}`,
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
      wordBreak: 'normal',
    };
  },
);
