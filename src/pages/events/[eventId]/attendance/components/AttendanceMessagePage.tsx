import type { ReactElement } from 'react';

import type { AttendanceMessageState } from '../attendancePageState';
import { AttendancePageContent } from './AttendancePageContent';
import { AttendancePageShell } from './AttendancePageShell';

type AttendanceMessagePageProps = {
  onBack: () => void;
  pageState: AttendanceMessageState;
};

export const AttendanceMessagePage = ({
  onBack,
  pageState,
}: AttendanceMessagePageProps): ReactElement => {
  return (
    <AttendancePageShell onBack={onBack}>
      <AttendancePageContent pageState={pageState} />
    </AttendancePageShell>
  );
};
