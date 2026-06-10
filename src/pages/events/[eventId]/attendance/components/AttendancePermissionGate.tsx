import type { ReactElement } from 'react';

import type { AttendanceMessageState } from '../attendancePageState';
import { useEventAttendancePermission } from '../useEventAttendancePage';
import { AttendanceMessagePage } from './AttendanceMessagePage';
import { AttendancePageBoundary } from './AttendancePageBoundary';
import { AttendanceReadyPage } from './AttendanceReadyPage';

const ATTENDANCE_LOADING_STATE: AttendanceMessageState = {
  message: '출석 정보를 불러오고 있어요',
  role: 'status',
  status: 'message',
};

const ATTENDANCE_ERROR_STATE: AttendanceMessageState = {
  message: '출석 정보를 확인할 수 없어요',
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
  handleBack: () => void;
};

export const AttendancePermissionGate = ({
  eventId,
  handleBack,
}: AttendancePermissionGateProps): ReactElement => {
  const { canManageAttendance } = useEventAttendancePermission(eventId);

  if (!canManageAttendance) {
    return (
      <AttendanceMessagePage
        handleBack={handleBack}
        pageState={FORBIDDEN_STATE}
      />
    );
  }

  return (
    <AttendancePageBoundary
      errorState={ATTENDANCE_ERROR_STATE}
      handleBack={handleBack}
      loadingState={ATTENDANCE_LOADING_STATE}
    >
      <AttendanceReadyPage eventId={eventId} handleBack={handleBack} />
    </AttendancePageBoundary>
  );
};
