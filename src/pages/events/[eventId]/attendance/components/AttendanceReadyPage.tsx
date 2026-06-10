import type { ReactElement } from 'react';

import { HiddenText } from '@/components';

import { useEventAttendancePage } from '../useEventAttendancePage';
import { AttendancePageContent } from './AttendancePageContent';
import { AttendancePageShell } from './AttendancePageShell';

type AttendanceReadyPageProps = {
  eventId: number;
  handleBack: () => void;
};

export const AttendanceReadyPage = ({
  eventId,
  handleBack,
}: AttendanceReadyPageProps): ReactElement => {
  const {
    announcement,
    attendancePageState,
    attendParticipant,
    cancelAttendance,
    isUpdatingAttendance,
  } = useEventAttendancePage(eventId);

  return (
    <AttendancePageShell handleBack={handleBack} pageState={attendancePageState}>
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
