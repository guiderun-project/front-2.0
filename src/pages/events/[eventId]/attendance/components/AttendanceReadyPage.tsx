import type { ReactElement } from 'react';

import { HiddenText } from '@/components';

import { useEventAttendancePage } from '../useEventAttendancePage';
import { AttendanceLeadDescription } from './AttendanceLeadDescription';
import { AttendancePageContent } from './AttendancePageContent';
import { AttendancePageShell } from './AttendancePageShell';

type AttendanceReadyPageProps = {
  eventId: number;
  onBack: () => void;
};

export const AttendanceReadyPage = ({
  eventId,
  onBack,
}: AttendanceReadyPageProps): ReactElement => {
  const {
    announcement,
    attendancePageState,
    attendParticipant,
    cancelAttendance,
    isUpdatingAttendance,
  } = useEventAttendancePage(eventId);
  const waitingCount = attendancePageState.attendance.summary.waitingCount;

  return (
    <AttendancePageShell
      description={<AttendanceLeadDescription waitingCount={waitingCount} />}
      onBack={onBack}
    >
      <HiddenText aria-live="polite" role="status">
        {announcement}
      </HiddenText>
      <AttendancePageContent
        isUpdatingAttendance={isUpdatingAttendance}
        pageState={attendancePageState}
        onAttend={attendParticipant}
        onCancelAttendance={cancelAttendance}
      />
    </AttendancePageShell>
  );
};
