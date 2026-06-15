import type { ReactElement } from 'react';

import type { AttendanceMessageState } from '../attendancePageState';
import { AttendancePageContent } from './AttendancePageContent';
import { AttendancePageShell } from './AttendancePageShell';

type AttendanceMessagePageProps = {
  pageState: AttendanceMessageState;
};

export const AttendanceMessagePage = ({
  pageState,
}: AttendanceMessagePageProps): ReactElement => {
  return (
    <AttendancePageShell>
      <AttendancePageContent pageState={pageState} />
    </AttendancePageShell>
  );
};
