const LOADER_COMPLETE_MESSAGE = '불러왔어요.';
// 새로 삽입된 라이브 리전을 브라우저/스크린리더가 인식할 시간을 준 뒤
// 텍스트를 주입해야 낭독 누락을 막을 수 있다.
export const LIVE_REGION_ANNOUNCE_DELAY_MS = 150;
const COMPLETION_REGION_REMOVE_DELAY_MS = 3000;

type LoaderCompletionAnnouncer = {
  region: HTMLElement;
  announceTimerId: number;
  removeTimerId: number;
};

let loaderCompletionAnnouncer: LoaderCompletionAnnouncer | null = null;

// Loader 언마운트가 곧 로딩 성공을 뜻하지는 않으므로, 오류 UI 마운트나
// 라우트 전환처럼 완료가 아닌 전환에서는 이 함수를 호출해 예약된
// "불러왔어요." 안내를 취소해야 한다. (안내 주입까지 150ms 지연을 두어
// 취소할 수 있는 시간 창을 확보한다.)
export const cancelLoaderCompletionAnnouncement = () => {
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
export const scheduleLoaderCompletionAnnouncement = () => {
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
