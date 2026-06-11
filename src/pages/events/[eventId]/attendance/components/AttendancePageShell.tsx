import type { ReactElement, ReactNode } from 'react';

import { FormPageLayout, PageLayout } from '@/components';

import { useEventAttendanceRoute } from '../useEventAttendancePage';

type AttendancePageShellProps = {
  children: ReactNode;
  description?: ReactNode;
};

export const AttendancePageShell = ({
  children,
  description,
}: AttendancePageShellProps): ReactElement => {
  const { onBack } = useEventAttendanceRoute();

  return (
    <PageLayout background="bg.subtle">
      <FormPageLayout
        description={description}
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
