import type { ReactElement } from 'react';

import type { AttendanceMessageState } from '../attendancePageState';
import { AttendancePageContent } from './AttendancePageContent';
import { AttendancePageShell } from './AttendancePageShell';

type AttendanceMessagePageProps = {
  handleBack: () => void;
  pageState: AttendanceMessageState;
};

export const AttendanceMessagePage = ({
  handleBack,
  pageState,
}: AttendanceMessagePageProps): ReactElement => {
  return (
    <AttendancePageShell handleBack={handleBack} pageState={pageState}>
      <AttendancePageContent pageState={pageState} />
    </AttendancePageShell>
  );
};
