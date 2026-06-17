import type { ReactElement } from 'react';

import type { AttendanceMessageState } from '../attendancePageState';
import { useEventAttendancePermission } from '../useEventAttendancePage';
import { AttendanceMessagePage } from './AttendanceMessagePage';
import { AttendancePageBoundary } from './AttendancePageBoundary';
import { AttendanceReadyPage } from './AttendanceReadyPage';

const ATTENDANCE_LOADING_STATE: AttendanceMessageState = {
  message: '출석 정보를 가지고 오고 있어요',
  role: 'status',
  status: 'message',
};

const ATTENDANCE_ERROR_STATE: AttendanceMessageState = {
  message: '출석 정보를 가지고 오지 못했어요',
  role: 'alert',
  status: 'message',
};

const FORBIDDEN_STATE: AttendanceMessageState = {
  message: '출석 관리는 이벤트 주최자 또는 관리자만 가능해요',
  role: 'alert',
  status: 'message',
};

type AttendancePermissionGateProps = {
  eventId: number;
};

export const AttendancePermissionGate = ({
  eventId,
}: AttendancePermissionGateProps): ReactElement => {
  const { canManageAttendance } = useEventAttendancePermission();

  if (!canManageAttendance) {
    return <AttendanceMessagePage pageState={FORBIDDEN_STATE} />;
  }

  return (
    <AttendancePageBoundary
      errorState={ATTENDANCE_ERROR_STATE}
      loadingState={ATTENDANCE_LOADING_STATE}
    >
      <AttendanceReadyPage eventId={eventId} />
    </AttendancePageBoundary>
  );
};
