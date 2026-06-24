import { Suspense, lazy, type ComponentPropsWithoutRef, type ReactElement } from 'react';

import styled from '@emotion/styled';

import loadingDark from '@/assets/lotties/loading_dark.json';
import loadingWhite from '@/assets/lotties/loading_white.json';
import { HiddenText } from '@/components/HiddenText';
import { useColorMode } from '@/styles/useColorMode';

type LoaderProps = {
  label?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

const DEFAULT_LOADER_LABEL = '불러오는 중이에요.';
const Lottie = lazy(() => import('lottie-react'));

export const Loader = ({
  label = DEFAULT_LOADER_LABEL,
  ...props
}: LoaderProps): ReactElement => {
  const { colorMode } = useColorMode();
  const animationData = colorMode === 'dark' ? loadingWhite : loadingDark;

  return (
    <LoaderWrapper role="status" aria-live="polite" {...props}>
      <HiddenText>{label}</HiddenText>
      <LoaderAnimation aria-hidden={true}>
        <Suspense fallback={null}>
          <Lottie
            key={colorMode}
            animationData={animationData}
            autoplay={true}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      </LoaderAnimation>
    </LoaderWrapper>
  );
};

export const LoaderScreen = ({
  label,
  ...props
}: LoaderProps): ReactElement => {
  return (
    <LoaderScreenContainer {...props}>
      <Loader label={label} />
    </LoaderScreenContainer>
  );
};

export const LoaderOverlay = ({
  label,
  ...props
}: LoaderProps): ReactElement => {
  return (
    <LoaderOverlayContainer {...props}>
      <Loader label={label} />
    </LoaderOverlayContainer>
  );
};

export const LoaderWrapper = styled.div(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  width: theme.pxToRem(90),
  height: theme.pxToRem(90),
  overflow: 'hidden',
  borderRadius: theme.radius.lg,
  background: theme.color.bg.overlay,
}));

const LoaderAnimation = styled.div(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  width: theme.pxToRem(58),
  height: theme.pxToRem(58),
}));

const LoaderScreenContainer = styled.div(({ theme }) => ({
  display: 'grid',
  minHeight: '100dvh',
  placeItems: 'center',
  padding: theme.spacing['2xl'],
}));

const LoaderOverlayContainer = styled.div(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.modal,
  display: 'grid',
  placeItems: 'center',
  padding: theme.spacing['2xl'],
}));
