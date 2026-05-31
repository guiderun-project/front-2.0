import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

import {
  resolveColorToken,
  type ColorToken,
  type TypographyToken,
  type spacing,
} from '@/styles/tokens';

const DEFAULT_BADGE_SIZE = 's';
const DEFAULT_BADGE_VARIANT = 'soft';
const DEFAULT_BADGE_TONE = 'gray';

const BADGE_SIZE_STYLES = {
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

const BADGE_COLOR_STYLES = {
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

export type BadgeSize = keyof typeof BADGE_SIZE_STYLES;
export type BadgeVariant = keyof typeof BADGE_COLOR_STYLES;
export type BadgeTone<TVariant extends BadgeVariant> = TVariant extends BadgeVariant
  ? keyof (typeof BADGE_COLOR_STYLES)[TVariant]
  : never;

type BadgeBaseProps = {
  children: ReactNode;
  size?: BadgeSize;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'>;

export type BadgeProps<TVariant extends BadgeVariant = typeof DEFAULT_BADGE_VARIANT> =
  BadgeBaseProps & {
    variant?: TVariant;
    tone?: BadgeTone<TVariant>;
  };

type BadgeColorStyle = {
  background: ColorToken;
  text: ColorToken;
};

type BadgeStyleProps = {
  $background: ColorToken;
  $font: TypographyToken;
  $minHeight: number;
  $paddingX: keyof typeof spacing;
  $text: ColorToken;
};

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
