import { useEffect, type ComponentPropsWithoutRef, type ReactElement } from 'react';

import styled from '@emotion/styled';

import {
  resolveColorToken,
  resolveGradientToken,
  type ColorToken,
  type GradientToken,
} from '@/styles/tokens';

type PageLayoutColorBackground = Extract<ColorToken, `bg.${string}`>;
type PageLayoutGradientBackground = `gradient.${GradientToken}`;

export type PageLayoutBackground = PageLayoutColorBackground | PageLayoutGradientBackground;

type PageLayoutProps = {
  background?: PageLayoutBackground;
} & ComponentPropsWithoutRef<'main'>;

const DEFAULT_BACKGROUND = 'bg.default' satisfies PageLayoutBackground;
const GRADIENT_BACKGROUND_PREFIX = 'gradient.' as const;
const APP_WRAPPER_BACKGROUND_VARIABLE = '--page-layout-background';

export const PageLayout = ({
  background = DEFAULT_BACKGROUND,
  ...props
}: PageLayoutProps): ReactElement => {
  const resolvedBackground = resolvePageLayoutBackground(background);

  useEffect(() => {
    const root = document.documentElement;
    const previousBackground = root.style.getPropertyValue(APP_WRAPPER_BACKGROUND_VARIABLE);

    root.style.setProperty(APP_WRAPPER_BACKGROUND_VARIABLE, resolvedBackground);

    return () => {
      if (previousBackground) {
        root.style.setProperty(APP_WRAPPER_BACKGROUND_VARIABLE, previousBackground);
        return;
      }

      root.style.removeProperty(APP_WRAPPER_BACKGROUND_VARIABLE);
    };
  }, [resolvedBackground]);

  return <StyledPageLayout $background={resolvedBackground} {...props} />;
};

const resolvePageLayoutBackground = (background: PageLayoutBackground) => {
  if (background.startsWith(GRADIENT_BACKGROUND_PREFIX)) {
    return resolveGradientToken(
      background.slice(GRADIENT_BACKGROUND_PREFIX.length) as GradientToken,
    );
  }

  return resolveColorToken(background as PageLayoutColorBackground);
};

const StyledPageLayout = styled.main<{ $background: string }>(({ $background }) => {
  const fixedBottomOffset = 'var(--app-fixed-bottom-offset, 0rem)';
  const bottomSafeArea = 'env(safe-area-inset-bottom)';
  const bottomOffset = `calc(${bottomSafeArea} + ${fixedBottomOffset})`;

  return {
    minHeight: '100dvh',
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: bottomOffset,
    scrollPaddingBottom: bottomOffset,
    background: $background,
  };
});
