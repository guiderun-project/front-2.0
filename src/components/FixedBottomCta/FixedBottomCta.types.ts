import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type FixedBottomCtaProps = {
  children: ReactNode;
  reserveSpace?: boolean;
} & Omit<ComponentPropsWithoutRef<'footer'>, 'children'>;
