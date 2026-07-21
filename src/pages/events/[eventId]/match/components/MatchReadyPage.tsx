import { useEffect, useState, type ReactElement } from 'react';

import { ConfirmPopup, HiddenText } from '@/components';

import type { EventGroupLabelContext } from '../../utils';
import {
  type EventMatchPageModel,
  useEventMatchPage,
  useEventMatchRoute,
} from '../useEventMatchPage';
import { MatchLeadDescription } from './MatchLeadDescription';
import { MatchPageContent } from './MatchPageContent';
import { MatchPageShell } from './MatchPageShell';

type MatchReadyPageProps = {
  eventGroupLabelContext: EventGroupLabelContext;
  eventId: number;
};

export const MatchReadyPage = ({
  eventGroupLabelContext,
  eventId,
}: MatchReadyPageProps): ReactElement => {
  const matchPage = useEventMatchPage(eventId);

  return (
    <MatchReadyPageContent
      eventGroupLabelContext={eventGroupLabelContext}
      matchPage={matchPage}
    />
  );
};

type MatchReadyPageContentProps = {
  eventGroupLabelContext: EventGroupLabelContext;
  matchPage: EventMatchPageModel;
};

const MatchReadyPageContent = ({
  eventGroupLabelContext,
  matchPage,
}: MatchReadyPageContentProps): ReactElement => {
  const { navigateBack } = useEventMatchRoute();
  const {
    announcement,
    clearSelection,
    hasSelection,
    pageState,
  } = matchPage;
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  // 로딩 화면과 실제 콘텐츠가 같은 페이지 제목(h1)을 렌더링해 텍스트만으로는
  // 준비 완료를 알 수 없으므로, 콘텐츠가 준비된 마운트 시점에 제목으로
  // 포커스를 옮겨 스크린리더에 탐색 시작 지점을 알린다(apply의
  // focusFirstHeading 패턴과 동일). 프로그램적 포커스라 시각 변화는 없다.
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('main h1');

      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);
  const waitingCount = pageState.waiting.summary.waitingCount;
  const pageTitle =
    waitingCount > 0
      ? '매칭하고 싶은 참가자를\n차례대로 선택해주세요'
      : '매칭을 모두 완료했어요';
  const pageDescription =
    waitingCount > 0 ? (
      <MatchLeadDescription waitingCount={waitingCount} />
    ) : undefined;
  const politeAnnouncement =
    announcement.politeness === 'polite' ? announcement.message : '';
  const assertiveAnnouncement =
    announcement.politeness === 'assertive' ? announcement.message : '';

  const handleBack = () => {
    if (hasSelection) {
      setIsExitConfirmOpen(true);
      return;
    }

    navigateBack();
  };

  const handleConfirmExit = () => {
    clearSelection();
    setIsExitConfirmOpen(false);
    navigateBack();
  };

  return (
    <MatchPageShell
      description={pageDescription}
      title={pageTitle}
      onBack={handleBack}
    >
      <HiddenText role="status">{politeAnnouncement}</HiddenText>
      <HiddenText role="alert">{assertiveAnnouncement}</HiddenText>
      <MatchPageContent
        eventGroupLabelContext={eventGroupLabelContext}
        matchPage={matchPage}
      />

      <ConfirmPopup
        cancelText="아니요"
        confirmText="네, 그만할게요"
        description="지금까지 선택한 매칭은 저장되지 않아요."
        open={isExitConfirmOpen}
        title="매칭을 그만할까요?"
        onCancel={() => {
          setIsExitConfirmOpen(false);
        }}
        onConfirm={handleConfirmExit}
        onOpenChange={setIsExitConfirmOpen}
      />
    </MatchPageShell>
  );
};
