import type { ComponentPropsWithoutRef } from 'react';

import type { IconColor, IconName } from '@/components/Icon';
import type { ColorToken, TypographyToken } from '@/styles/tokens';

export type ButtonSize = 's' | 'm' | 'l';
export type ButtonLevel = 'primary' | 'secondary' | 'line-type' | 'quaternary';
export type ButtonStatus = 'default' | 'selected' | 'pressed' | 'disabled';

export type ButtonProps = {
  level?: ButtonLevel;
  size?: ButtonSize;
  status?: ButtonStatus;
  leftIcon?: boolean;
  rightIcon?: boolean;
  leftIconName?: IconName;
  rightIconName?: IconName;
  leftIconColor?: IconColor;
  rightIconColor?: IconColor;
  fullWidth?: boolean;
} & Omit<ComponentPropsWithoutRef<'button'>, 'color'>;

export type ButtonStyleProps = {
  $fullWidth: boolean;
  $level: ButtonLevel;
  $size: ButtonSize;
  $status: ButtonStatus;
};

export type ButtonSizeStyle = {
  height: '4xl' | '5xl' | '6xl';
  minWidth: number;
  paddingX: 'lg' | 'xl' | '2xl';
  gap: 'sm';
  iconSize: number;
  radius: 's' | 'sm';
  typography: TypographyToken;
};

export type ButtonColorTokens = {
  background: ColorToken;
  border: ColorToken;
  content: ColorToken;
};
