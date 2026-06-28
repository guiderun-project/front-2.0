import type { GradientToken } from '@/styles/tokens';

import type { FooterButtonProps } from './FooterButton.types';

type Assert<T extends true> = T;
type Equal<Left, Right> =
  (<T>() => T extends Left ? 1 : 2) extends
  (<T>() => T extends Right ? 1 : 2)
    ? true
    : false;

type FooterButtonBackground = NonNullable<FooterButtonProps['background']>;

export type FooterButtonBackgroundSupportsSubtle = Assert<
  Equal<FooterButtonBackground, 'footer' | 'subtle'>
>;

type FooterSubtleGradientToken = Extract<GradientToken, 'bg.footer-subtle'>;

export type FooterButtonSubtleBackgroundUsesDedicatedGradient = Assert<
  Equal<FooterSubtleGradientToken, 'bg.footer-subtle'>
>;
