import type { ReactElement } from 'react';

import { FormPageLayout, HiddenText, PageLayout } from '@/components';

import { AttendanceLeadDescription } from './components/AttendanceLeadDescription';
import { AttendancePageContent } from './components/AttendancePageContent';
import { useEventAttendancePage } from './useEventAttendancePage';

export const EventAttendancePage = (): ReactElement => {
  const {
    announcement,
    attendancePageState,
    attendParticipant,
    cancelAttendance,
    handleBack,
    isUpdatingAttendance,
  } = useEventAttendancePage();

  return (
    <PageLayout background="bg.subtle">
      <FormPageLayout
        description={
          <AttendanceLeadDescription pageState={attendancePageState} />
        }
        title={'출석할 참가자를\n선택해주세요'}
        topNavigation={{
          left: {
            ariaLabel: '이전 페이지로 이동',
            icon: 'chevron-left-lined',
            onClick: handleBack,
          },
        }}
      >
        <HiddenText aria-live="polite" role="status">
          {announcement}
        </HiddenText>
        <AttendancePageContent
          isUpdatingAttendance={isUpdatingAttendance}
          onAttend={attendParticipant}
          onCancelAttendance={cancelAttendance}
          pageState={attendancePageState}
        />
      </FormPageLayout>
    </PageLayout>
  );
};
