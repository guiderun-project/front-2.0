import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { ButtonGroupRatio } from '../Button';

export type FooterButtonProps = {
  children: ReactNode;
  ratio?: ButtonGroupRatio;
  reserveSpace?: boolean;
} & Omit<ComponentPropsWithoutRef<'footer'>, 'children'>;
