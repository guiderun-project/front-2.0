import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from 'react';

import styled from '@emotion/styled';

import loadingDark from '@/assets/lotties/loading_dark.json';
import loadingWhite from '@/assets/lotties/loading_white.json';
import { HiddenText } from '@/components/HiddenText';
import { useColorMode } from '@/styles/useColorMode';

import {
  LIVE_REGION_ANNOUNCE_DELAY_MS,
  cancelLoaderCompletionAnnouncement,
  scheduleLoaderCompletionAnnouncement,
} from './loaderCompletionAnnouncement';

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
  // 라이브 리전은 빈 상태로 먼저 마운트한 뒤 잠시 후 라벨을 주입해야
  // VoiceOver/TalkBack이 로딩 시작을 안정적으로 낭독한다.
  const [announcedLabel, setAnnouncedLabel] = useState('');
  const hasAnnouncedStartRef = useRef(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      hasAnnouncedStartRef.current = true;
      setAnnouncedLabel(label);
    }, LIVE_REGION_ANNOUNCE_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [label]);

  useEffect(() => {
    // 새 로딩이 시작되면 직전 완료 안내는 취소한다 (StrictMode 재실행 포함).
    cancelLoaderCompletionAnnouncement();
    const mountPathname = window.location.pathname;

    return () => {
      // 시작 안내가 낭독되기 전에 끝난 빠른 로딩은 완료 안내를 생략한다.
      // 시작을 듣지 못한 사용자에게 맥락 없는 "불러왔어요."만 남기 때문이다.
      if (!hasAnnouncedStartRef.current) {
        return;
      }

      // 뒤로가기·리다이렉트 등 라우트 이탈로 인한 언마운트는 로딩 완료가
      // 아니므로 건너뛴다. 새 페이지 안내는 RouteAnnouncer가 담당한다.
      if (window.location.pathname !== mountPathname) {
        return;
      }

      scheduleLoaderCompletionAnnouncement();
    };
  }, []);

  return (
    <LoaderWrapper role="status" aria-live="polite" {...props}>
      <HiddenText>{announcedLabel}</HiddenText>
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
