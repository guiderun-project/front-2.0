import type { ComponentPropsWithoutRef } from 'react';

import type { IconColor, IconName } from '@/components/Icon';

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
