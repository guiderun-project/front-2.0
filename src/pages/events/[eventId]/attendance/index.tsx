import type { ReactElement } from 'react';

import { useAuth } from '@/contexts';

import type { AttendanceMessageState } from './attendancePageState';
import { AttendanceMessagePage } from './components/AttendanceMessagePage';
import { AttendancePageBoundary } from './components/AttendancePageBoundary';
import { AttendancePermissionGate } from './components/AttendancePermissionGate';
import { useEventAttendanceRoute } from './useEventAttendancePage';

const EVENT_CHECKING_STATE: AttendanceMessageState = {
  message: '이벤트 정보를 가지고 오고 있어요',
  role: 'status',
  status: 'message',
};

const EVENT_ERROR_STATE: AttendanceMessageState = {
  message: '이벤트 정보를 가지고 오지 못했어요',
  role: 'alert',
  status: 'message',
};

const INVALID_EVENT_STATE: AttendanceMessageState = {
  message: '잘못된 이벤트 주소예요',
  role: 'alert',
  status: 'message',
};

export const EventAttendancePage = (): ReactElement => {
  const { eventId } = useEventAttendanceRoute();
  const { isAuthReady } = useAuth();

  if (eventId === null) {
    return <AttendanceMessagePage pageState={INVALID_EVENT_STATE} />;
  }

  if (!isAuthReady) {
    return <AttendanceMessagePage pageState={EVENT_CHECKING_STATE} />;
  }

  return (
    <AttendancePageBoundary
      errorState={EVENT_ERROR_STATE}
      loadingState={EVENT_CHECKING_STATE}
    >
      <AttendancePermissionGate eventId={eventId} />
    </AttendancePageBoundary>
  );
};
