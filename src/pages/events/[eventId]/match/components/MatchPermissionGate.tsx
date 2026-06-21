import type { ReactElement } from 'react';

import type { MatchMessageState } from '../matchPageState';
import { useEventMatchPermission } from '../useEventMatchPage';
import { MatchMessagePage } from './MatchMessagePage';
import { MatchPageBoundary } from './MatchPageBoundary';
import { MatchReadyPage } from './MatchReadyPage';

const MATCH_LOADING_STATE: MatchMessageState = {
  message: '매칭 정보를 가지고 오고 있어요',
  role: 'status',
};

const MATCH_ERROR_STATE: MatchMessageState = {
  message: '매칭 정보를 가지고 오지 못했어요',
  role: 'alert',
};

const FORBIDDEN_STATE: MatchMessageState = {
  message: '매칭 관리는 이벤트 주최자 또는 관리자만 가능해요',
  role: 'alert',
};

type MatchPermissionGateProps = {
  eventId: number;
};

export const MatchPermissionGate = ({
  eventId,
}: MatchPermissionGateProps): ReactElement => {
  const { canManageMatching, eventGroupLabelContext } =
    useEventMatchPermission();

  if (!canManageMatching) {
    return <MatchMessagePage pageState={FORBIDDEN_STATE} />;
  }

  return (
    <MatchPageBoundary
      errorState={MATCH_ERROR_STATE}
      loadingState={MATCH_LOADING_STATE}
    >
      <MatchReadyPage
        eventGroupLabelContext={eventGroupLabelContext}
        eventId={eventId}
      />
    </MatchPageBoundary>
  );
};
