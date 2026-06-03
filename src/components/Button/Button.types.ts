import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { IconProps } from '../Icon';

export type ButtonSize = 's' | 'm' | 'l';
export type ButtonLevel = 'primary' | 'secondary' | 'line-type' | 'quaternary';
export type ButtonStatus = 'default' | 'selected' | 'pressed' | 'disabled';
export type ButtonIconProps = Omit<IconProps, 'aria-hidden' | 'size'>;
export type ButtonGroupRatio = '50:50' | '35:65' | '100:100';

export type ButtonProps = {
  level?: ButtonLevel;
  size?: ButtonSize;
  status?: ButtonStatus;
  leftIcon?: ButtonIconProps;
  rightIcon?: ButtonIconProps;
} & Omit<ComponentPropsWithoutRef<'button'>, 'color'>;

export type ButtonGroupProps = {
  children: ReactNode;
  ratio?: ButtonGroupRatio;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;
