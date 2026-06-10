import type { ReactElement } from 'react';

import type { AttendanceMessageState } from '../attendancePageState';
import { AttendancePageContent } from './AttendancePageContent';
import { AttendancePageShell } from './AttendancePageShell';

type AttendanceMessagePageProps = {
  pageState: AttendanceMessageState;
  onBack: () => void;
};

export const AttendanceMessagePage = ({
  pageState,
  onBack,
}: AttendanceMessagePageProps): ReactElement => {
  return (
    <AttendancePageShell onBack={onBack}>
      <AttendancePageContent pageState={pageState} />
    </AttendancePageShell>
  );
};
