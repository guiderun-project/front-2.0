import {
  useLayoutEffect,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from 'react';

import styled from '@emotion/styled';

import {
  resolveGradientBackgroundHeight,
  resolveColorToken,
  resolveGradientToken,
  type ColorToken,
  type GradientToken,
} from '@/styles/tokens';

type PageLayoutColorBackground = Extract<ColorToken, `bg.${string}`>;
type PageLayoutGradientToken = Extract<GradientToken, `bg.${string}`>;
export type PageLayoutGradientBackground = `gradient.${PageLayoutGradientToken}`;

export type PageLayoutBackground =
  | PageLayoutColorBackground
  | PageLayoutGradientBackground;

type PageLayoutProps = {
  background?: PageLayoutBackground;
  gradient?: PageLayoutGradientBackground;
} & ComponentPropsWithoutRef<'main'>;

const DEFAULT_BACKGROUND = 'bg.default' satisfies PageLayoutBackground;
const GRADIENT_BACKGROUND_PREFIX = 'gradient.' as const;
const PAGE_LAYOUT_BACKGROUND_COLOR_VARIABLE = '--page-layout-background-color';
const PAGE_LAYOUT_BACKGROUND_IMAGE_VARIABLE = '--page-layout-background-image';
const PAGE_LAYOUT_BACKGROUND_GRADIENT_HEIGHT_VARIABLE =
  '--page-layout-background-gradient-height';
const DEFAULT_GRADIENT_BACKGROUND_HEIGHT = '100%';

const GRADIENT_FALLBACK_BACKGROUNDS = {
  'bg.subtle': 'bg.subtle',
  'bg.brand-main': 'bg.subtle',
  'bg.brand-event': 'bg.brand-event',
  'bg.brand-event-overlay': 'bg.brand-event',
  'bg.footer': 'bg.default',
} as const satisfies Partial<Record<PageLayoutGradientToken, PageLayoutColorBackground>>;

type PageLayoutBackgroundLayers = {
  backgroundColor: string;
  gradientHeight?: string;
  gradientImage?: string;
};

type StyledPageLayoutProps = {
  $backgroundColor: string;
  $gradientHeight?: string;
  $gradientImage?: string;
};

export const PageLayout = ({
  background = DEFAULT_BACKGROUND,
  gradient,
  ...props
}: PageLayoutProps): ReactElement => {
  const backgroundLayers = useMemo(
    () => resolvePageLayoutBackgroundLayers(background, gradient),
    [background, gradient],
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    const variables = [
      [PAGE_LAYOUT_BACKGROUND_COLOR_VARIABLE, backgroundLayers.backgroundColor],
      [
        PAGE_LAYOUT_BACKGROUND_IMAGE_VARIABLE,
        backgroundLayers.gradientImage ?? 'none',
      ],
      [
        PAGE_LAYOUT_BACKGROUND_GRADIENT_HEIGHT_VARIABLE,
        backgroundLayers.gradientHeight ?? DEFAULT_GRADIENT_BACKGROUND_HEIGHT,
      ],
    ] as const;
    const previousVariables = variables.map(([name]) => [
      name,
      root.style.getPropertyValue(name),
    ] as const);

    variables.forEach(([name, value]) => {
      root.style.setProperty(name, value);
    });

    return () => {
      previousVariables.forEach(([name, previousValue]) => {
        if (previousValue) {
          root.style.setProperty(name, previousValue);
          return;
        }

        root.style.removeProperty(name);
      });
    };
  }, [backgroundLayers]);

  return (
    <StyledPageLayout
      $backgroundColor={backgroundLayers.backgroundColor}
      $gradientHeight={backgroundLayers.gradientHeight}
      $gradientImage={backgroundLayers.gradientImage}
      {...props}
    />
  );
};

const resolvePageLayoutBackgroundLayers = (
  background: PageLayoutBackground,
  gradient?: PageLayoutGradientBackground,
): PageLayoutBackgroundLayers => {
  const isGradientBackground = isPageLayoutGradientBackground(background);
  const gradientToken = gradient
    ? resolvePageLayoutGradientToken(gradient)
    : isGradientBackground
      ? resolvePageLayoutGradientToken(background)
      : null;
  const backgroundToken = isGradientBackground
    ? getGradientFallbackBackground(gradientToken)
    : background;

  return {
    backgroundColor: resolveColorToken(backgroundToken),
    gradientHeight: gradientToken
      ? resolveGradientBackgroundHeight(gradientToken)
      : undefined,
    gradientImage: gradientToken ? resolveGradientToken(gradientToken) : undefined,
  };
};

const resolvePageLayoutGradientToken = (
  background: PageLayoutGradientBackground,
): PageLayoutGradientToken => {
  return background.slice(GRADIENT_BACKGROUND_PREFIX.length) as PageLayoutGradientToken;
};

const isPageLayoutGradientBackground = (
  background: PageLayoutBackground,
): background is PageLayoutGradientBackground => {
  return background.startsWith(GRADIENT_BACKGROUND_PREFIX);
};

const getGradientFallbackBackground = (
  gradientToken: PageLayoutGradientToken | null,
): PageLayoutColorBackground => {
  if (!gradientToken) {
    return DEFAULT_BACKGROUND;
  }

  return GRADIENT_FALLBACK_BACKGROUNDS[gradientToken] ?? DEFAULT_BACKGROUND;
};

const StyledPageLayout = styled.main<StyledPageLayoutProps>(
  ({ $backgroundColor, $gradientHeight, $gradientImage }) => {
    const fixedBottomOffset = 'var(--app-fixed-bottom-offset, 0rem)';
    const bottomSafeArea = 'env(safe-area-inset-bottom)';
    const bottomOffset = `calc(${bottomSafeArea} + ${fixedBottomOffset})`;

    return {
      minHeight: '100dvh',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: bottomOffset,
      scrollPaddingBottom: bottomOffset,
      backgroundColor: $backgroundColor,
      ...($gradientImage
        ? {
            backgroundImage: $gradientImage,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `100% ${
              $gradientHeight ?? DEFAULT_GRADIENT_BACKGROUND_HEIGHT
            }`,
          }
        : {}),
    };
  },
);
