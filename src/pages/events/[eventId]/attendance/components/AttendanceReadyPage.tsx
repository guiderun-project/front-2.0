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
  } = useEventAttendancePage(eventId);
  const waitingCount = attendancePageState.attendance.summary.waitingCount;
  const politeAnnouncement =
    announcement.politeness === 'polite' ? announcement.message : '';
  const assertiveAnnouncement =
    announcement.politeness === 'assertive' ? announcement.message : '';

  return (
    <AttendancePageShell
      description={<AttendanceLeadDescription waitingCount={waitingCount} />}
    >
      <HiddenText role="status">{politeAnnouncement}</HiddenText>
      <HiddenText role="alert">{assertiveAnnouncement}</HiddenText>
      <AttendancePageContent
        pageState={attendancePageState}
        onAttend={attendParticipant}
        onCancelAttendance={cancelAttendance}
      />
    </AttendancePageShell>
  );
};
