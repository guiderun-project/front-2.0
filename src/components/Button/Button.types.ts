import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ButtonSize = 's' | 'm' | 'l';
export type ButtonLevel = 'primary' | 'secondary' | 'line-type' | 'quaternary';
export type ButtonStatus = 'default' | 'selected' | 'pressed' | 'disabled';

export type ButtonProps = {
  level?: ButtonLevel;
  size?: ButtonSize;
  status?: ButtonStatus;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'button'>, 'color'>;
