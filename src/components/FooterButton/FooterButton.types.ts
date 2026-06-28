import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { ButtonGroupRatio } from '../Button';

export type FooterButtonBackground = 'footer' | 'subtle';

export type FooterButtonProps = {
  background?: FooterButtonBackground;
  children: ReactNode;
  ratio?: ButtonGroupRatio;
  reserveSpace?: boolean;
} & Omit<ComponentPropsWithoutRef<'footer'>, 'children'>;
