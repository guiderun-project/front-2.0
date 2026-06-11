import type { ReactElement } from 'react';

import { HiddenText } from '@/components';

import { useEventAttendancePage } from '../useEventAttendancePage';
import { AttendanceLeadDescription } from './AttendanceLeadDescription';
import { AttendancePageContent } from './AttendancePageContent';
import { AttendancePageShell } from './AttendancePageShell';

type AttendanceReadyPageProps = {
  eventId: number;
};

export const AttendanceReadyPage = ({
  eventId,
}: AttendanceReadyPageProps): ReactElement => {
  const {
    announcement,
    attendancePageState,
    attendParticipant,
    cancelAttendance,
    updatingParticipantIds,
  } = useEventAttendancePage(eventId);
  const waitingCount = attendancePageState.attendance.summary.waitingCount;

  return (
    <AttendancePageShell
      description={<AttendanceLeadDescription waitingCount={waitingCount} />}
    >
      <HiddenText role="status">
        {announcement}
      </HiddenText>
      <AttendancePageContent
        pageState={attendancePageState}
        updatingParticipantIds={updatingParticipantIds}
        onAttend={attendParticipant}
        onCancelAttendance={cancelAttendance}
      />
    </AttendancePageShell>
  );
};
