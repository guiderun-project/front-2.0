import type { ReactElement, ReactNode } from 'react';

import { FormPageLayout, PageLayout } from '@/components';

type AttendancePageShellProps = {
  children: ReactNode;
  description?: ReactNode;
  onBack: () => void;
};

export const AttendancePageShell = ({
  children,
  description,
  onBack,
}: AttendancePageShellProps): ReactElement => {
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
