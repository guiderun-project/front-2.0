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
  const leadCount = attendancePageState.attendance.summary.waitingCount;

  return (
    <AttendancePageShell
      description={<AttendanceLeadDescription leadCount={leadCount} />}
      onBack={onBack}
    >
      <HiddenText aria-live="polite" role="status">
        {announcement}
      </HiddenText>
      <AttendancePageContent
        isUpdatingAttendance={isUpdatingAttendance}
        onAttend={attendParticipant}
        onCancelAttendance={cancelAttendance}
        pageState={attendancePageState}
      />
    </AttendancePageShell>
  );
};
