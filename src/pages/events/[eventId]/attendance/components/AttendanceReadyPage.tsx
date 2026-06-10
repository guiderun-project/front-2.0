import type { ReactElement } from 'react';

import { HiddenText } from '@/components';

import { useEventAttendancePage } from '../useEventAttendancePage';
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

  return (
    <AttendancePageShell onBack={onBack} pageState={attendancePageState}>
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
