import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components/Text';
import {
  TopNavigation,
  type TopNavigationProps,
} from '@/components/TopNavigation';

type FormPageTitleTag = 'h1' | 'h2';
type FormPageNavigationProps = Omit<TopNavigationProps, 'className'>;

export type FormPageLayoutProps = {
  title: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  topNavigation?: FormPageNavigationProps;
  titleAs?: FormPageTitleTag;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'title'>;

const HEADING_PROGRESS_VARIABLE = '--form-page-heading-progress';
const CONTENT_SURFACE_RADIUS_VARIABLE = '--form-page-content-surface-radius';
const HEADING_OPACITY_PROGRESS_MULTIPLIER = 1.75;
const MAX_HEADING_SCALE_OFFSET = 0.12;
const HEADING_TRANSLATE_Y_PX = -12;
const TOP_NAVIGATION_HEIGHT_PX = 56;

export const FormPageLayout = ({
  children,
  description,
  title,
  topNavigation,
  titleAs = 'h1',
  ...props
}: FormPageLayoutProps): ReactElement => {
  const hasTopNavigation = isTopNavigationRenderable(topNavigation);
  const headingRef = useRef<HTMLElement>(null);
  const headingHeightRef = useRef(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const contentSurfaceRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
      scrollAreaRef.current.style.setProperty(HEADING_PROGRESS_VARIABLE, '0');
    }

    if (contentSurfaceRef.current) {
      contentSurfaceRef.current.style.removeProperty(
        CONTENT_SURFACE_RADIUS_VARIABLE,
      );
    }
  }, []);

  useEffect(() => {
    const heading = headingRef.current;
    const scrollArea = scrollAreaRef.current;
    const contentSurface = contentSurfaceRef.current;
    if (!heading || !scrollArea || !contentSurface) {
      return;
    }

    const initialContentRadius = Number.parseFloat(
      window.getComputedStyle(contentSurface).borderTopLeftRadius,
    );
    let frameId: number | null = null;

    const updateProgress = () => {
      frameId = null;
      const nextProgress = clamp(
        scrollArea.scrollTop / Math.max(headingHeightRef.current, 1),
        0,
        1,
      );
      const nextRadius = Number.isFinite(initialContentRadius)
        ? initialContentRadius * (1 - nextProgress)
        : 0;

      scrollArea.style.setProperty(
        HEADING_PROGRESS_VARIABLE,
        String(nextProgress),
      );
      contentSurface.style.setProperty(
        CONTENT_SURFACE_RADIUS_VARIABLE,
        `${nextRadius}px`,
      );
    };

    const requestUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateProgress);
    };

    const updateHeadingHeight = () => {
      headingHeightRef.current = heading.offsetHeight;
      requestUpdate();
    };

    updateHeadingHeight();
    scrollArea.addEventListener('scroll', requestUpdate, { passive: true });
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateHeadingHeight);

    if (resizeObserver) {
      resizeObserver.observe(heading);
    } else {
      window.addEventListener('resize', updateHeadingHeight);
    }

    return () => {
      scrollArea.removeEventListener('scroll', requestUpdate);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateHeadingHeight);
      }

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <Layout {...props}>
      {hasTopNavigation ? (
        <TopNavigationArea>
          <TopNavigation
            {...topNavigation}
            titleAs={topNavigation.titleAs ?? 'h2'}
          />
        </TopNavigationArea>
      ) : null}
      <ScrollArea ref={scrollAreaRef}>
        <Heading ref={headingRef}>
          <HeadingContent>
            <Title as={titleAs} color="text.primary" font="heading-m-sb">
              {title}
            </Title>
            {isRenderable(description) ? (
              <Text as="p" color="text.tertiary" font="body-m-m">
                {description}
              </Text>
            ) : null}
          </HeadingContent>
        </Heading>
        <ContentSurface ref={contentSurfaceRef}>{children}</ContentSurface>
      </ScrollArea>
    </Layout>
  );
};

const isRenderable = (value: ReactNode): boolean =>
  value !== undefined && value !== null && value !== false && value !== '';

const isTopNavigationRenderable = (
  topNavigation: FormPageNavigationProps | undefined,
): topNavigation is FormPageNavigationProps =>
  Boolean(
    topNavigation &&
    (topNavigation.left ||
      isRenderable(topNavigation.title) ||
      (topNavigation.right && topNavigation.right.length > 0)),
  );

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const hiddenScrollbarStyles = {
  scrollbarWidth: 'none',

  '&::-webkit-scrollbar': {
    display: 'none',
  },
} as const;

const Layout = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: 'calc(100dvh - env(safe-area-inset-top))',
  overflow: 'hidden',
  backgroundColor: `var(--page-layout-background-color, ${theme.color.bg.default})`,
  backgroundImage: 'var(--page-layout-background-image, none)',
  backgroundPosition: 'top center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% var(--page-layout-background-gradient-height, 100%)',
}));

const TopNavigationArea = styled.div(({ theme }) => ({
  position: 'relative',
  zIndex: theme.zIndex.control,
  flex: `0 0 ${theme.pxToRem(TOP_NAVIGATION_HEIGHT_PX)}`,
  backgroundColor: `var(--page-layout-background-color, ${theme.color.bg.default})`,
  backgroundImage: 'var(--page-layout-background-image, none)',
  backgroundPosition: 'top center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% var(--page-layout-background-gradient-height, 100%)',
}));

const ScrollArea = styled.div({
  [HEADING_PROGRESS_VARIABLE]: 0,
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  ...hiddenScrollbarStyles,
});

const Heading = styled.header(({ theme }) => ({
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
}));

const HeadingContent = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.lg,
  opacity: `clamp(0, calc(1 - var(${HEADING_PROGRESS_VARIABLE}) * ${HEADING_OPACITY_PROGRESS_MULTIPLIER}), 1)`,
  transform: `translateY(calc(var(${HEADING_PROGRESS_VARIABLE}) * ${theme.pxToRem(
    HEADING_TRANSLATE_Y_PX,
  )})) scale(calc(1 - var(${HEADING_PROGRESS_VARIABLE}) * ${MAX_HEADING_SCALE_OFFSET}))`,
  transformOrigin: 'bottom center',
  willChange: 'opacity, transform',

  '@media (prefers-reduced-motion: reduce)': {
    opacity: 1,
    transform: 'none',
    willChange: 'auto',
  },
}));

const Title = styled(Text)({
  whiteSpace: 'pre-line',
});

const ContentSurface = styled.div(({ theme }) => ({
  [CONTENT_SURFACE_RADIUS_VARIABLE]: theme.radius.xl,
  position: 'sticky',
  top: 0,
  boxSizing: 'border-box',
  minHeight: '100%',
  borderTopLeftRadius: `var(${CONTENT_SURFACE_RADIUS_VARIABLE}, ${theme.radius.none})`,
  borderTopRightRadius: `var(${CONTENT_SURFACE_RADIUS_VARIABLE}, ${theme.radius.none})`,
  background: theme.color.bg.default,
}));
