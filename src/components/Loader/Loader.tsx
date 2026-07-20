import {
  Suspense,
  lazy,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from 'react';

import styled from '@emotion/styled';

import loadingDark from '@/assets/lotties/loading_dark.json';
import loadingWhite from '@/assets/lotties/loading_white.json';
import { HiddenText } from '@/components/HiddenText';
import { useColorMode } from '@/styles/useColorMode';

type LoaderProps = {
  label?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

const DEFAULT_LOADER_LABEL = '불러오는 중이에요.';
const LOADER_COMPLETE_MESSAGE = '불러왔어요.';
// 새로 삽입된 라이브 리전을 브라우저/스크린리더가 인식할 시간을 준 뒤
// 텍스트를 주입해야 낭독 누락을 막을 수 있다.
const LIVE_REGION_ANNOUNCE_DELAY_MS = 150;
const COMPLETION_REGION_REMOVE_DELAY_MS = 3000;
const Lottie = lazy(() => import('lottie-react'));

type LoaderCompletionAnnouncer = {
  region: HTMLElement;
  announceTimerId: number;
  removeTimerId: number;
};

let loaderCompletionAnnouncer: LoaderCompletionAnnouncer | null = null;

const cancelLoaderCompletionAnnouncement = () => {
  if (loaderCompletionAnnouncer === null) {
    return;
  }

  window.clearTimeout(loaderCompletionAnnouncer.announceTimerId);
  window.clearTimeout(loaderCompletionAnnouncer.removeTimerId);
  loaderCompletionAnnouncer.region.remove();
  loaderCompletionAnnouncer = null;
};

const createVisuallyHiddenStatusRegion = (): HTMLElement => {
  const region = document.createElement('div');
  region.setAttribute('role', 'status');
  // HiddenText와 동일한 visually-hidden 패턴 (화면에는 보이지 않음).
  Object.assign(region.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: '0',
    border: '0',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  });

  return region;
};

// Loader가 언마운트(로딩 완료)되면 React 트리에 라이브 리전이 남지 않으므로,
// body에 임시 SR 전용 리전을 빈 상태로 붙인 뒤 지연 주입으로 완료를 안내한다.
const scheduleLoaderCompletionAnnouncement = () => {
  cancelLoaderCompletionAnnouncement();

  const region = createVisuallyHiddenStatusRegion();
  document.body.appendChild(region);

  const announceTimerId = window.setTimeout(() => {
    region.textContent = LOADER_COMPLETE_MESSAGE;
  }, LIVE_REGION_ANNOUNCE_DELAY_MS);
  const removeTimerId = window.setTimeout(() => {
    cancelLoaderCompletionAnnouncement();
  }, COMPLETION_REGION_REMOVE_DELAY_MS);

  loaderCompletionAnnouncer = { region, announceTimerId, removeTimerId };
};

export const Loader = ({
  label = DEFAULT_LOADER_LABEL,
  ...props
}: LoaderProps): ReactElement => {
  const { colorMode } = useColorMode();
  const animationData = colorMode === 'dark' ? loadingWhite : loadingDark;
  // 라이브 리전은 빈 상태로 먼저 마운트한 뒤 잠시 후 라벨을 주입해야
  // VoiceOver/TalkBack이 로딩 시작을 안정적으로 낭독한다.
  const [announcedLabel, setAnnouncedLabel] = useState('');

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setAnnouncedLabel(label);
    }, LIVE_REGION_ANNOUNCE_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [label]);

  useEffect(() => {
    // 새 로딩이 시작되면 직전 완료 안내는 취소한다 (StrictMode 재실행 포함).
    cancelLoaderCompletionAnnouncement();

    return () => {
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
