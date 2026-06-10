import type { ReactElement, ReactNode } from 'react';

import { FormPageLayout, PageLayout } from '@/components';

import type { AttendancePageState } from '../attendancePageState';
import { AttendanceLeadDescription } from './AttendanceLeadDescription';

type AttendancePageShellProps = {
  children: ReactNode;
  onBack: () => void;
  pageState: AttendancePageState;
};

export const AttendancePageShell = ({
  children,
  onBack,
  pageState,
}: AttendancePageShellProps): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <FormPageLayout
        description={<AttendanceLeadDescription pageState={pageState} />}
        title={'출석할 참가자를\n선택해주세요'}
        topNavigation={{
          left: {
            ariaLabel: '이전 페이지로 이동',
            icon: 'chevron-left-lined',
            onClick: onBack,
          },
        }}
      >
        {children}
      </FormPageLayout>
    </PageLayout>
  );
};
