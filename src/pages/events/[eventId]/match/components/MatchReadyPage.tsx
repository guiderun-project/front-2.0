import { useState, type ReactElement } from 'react';

import { ConfirmPopup, HiddenText } from '@/components';

import {
  type EventMatchPageModel,
  useEventMatchPage,
  useEventMatchRoute,
} from '../useEventMatchPage';
import { MatchLeadDescription } from './MatchLeadDescription';
import { MatchPageContent } from './MatchPageContent';
import { MatchPageShell } from './MatchPageShell';

type MatchReadyPageProps = {
  eventId: number;
};

export const MatchReadyPage = ({
  eventId,
}: MatchReadyPageProps): ReactElement => {
  const matchPage = useEventMatchPage(eventId);

  return <MatchReadyPageContent matchPage={matchPage} />;
};

type MatchReadyPageContentProps = {
  matchPage: EventMatchPageModel;
};

const MatchReadyPageContent = ({
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
  const waitingCount = pageState.waiting.summary.waitingCount;
  const pageTitle =
    waitingCount > 0
      ? '매칭하고 싶은 참가자를\n차례대로 선택해주세요'
      : '매칭을 모두 완료했어요';
  const pageDescription =
    waitingCount > 0 ? (
      <MatchLeadDescription waitingCount={waitingCount} />
    ) : undefined;

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
      <HiddenText role="status">{announcement}</HiddenText>
      <MatchPageContent matchPage={matchPage} />

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
