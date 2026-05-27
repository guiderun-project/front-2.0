import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactElement } from 'react';

import styled from '@emotion/styled';

import { resolveColorToken, type ColorToken, type TypographyToken } from '@/styles/tokens';

const DEFAULT_FONT = 'body-s-r' satisfies TypographyToken;

type TextStyleProps = {
  $align?: CSSProperties['textAlign'];
  $color?: ColorToken;
  $font: TypographyToken;
};

export type TextProps<T extends ElementType = 'span'> = {
  align?: CSSProperties['textAlign'];
  as?: T;
  color?: ColorToken;
  font?: TypographyToken;
} & Omit<ComponentPropsWithoutRef<T>, 'align' | 'as' | 'color' | 'font'>;

export const Text = <T extends ElementType = 'span'>({
  align,
  as,
  color,
  font = DEFAULT_FONT,
  ...props
}: TextProps<T>): ReactElement => {
  return <StyledText $align={align} $color={color} $font={font} as={as} {...props} />;
};

const StyledText = styled.span<TextStyleProps>(({ $align, $color, $font, theme }) => {
  const typography = theme.typography[$font];

  return {
    margin: 0,
    color: $color ? resolveColorToken($color) : undefined,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    letterSpacing: typography.letterSpacing,
    lineHeight: typography.lineHeight,
    textAlign: $align,
  };
});
