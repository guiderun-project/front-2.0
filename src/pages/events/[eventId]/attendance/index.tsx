import type { ReactElement } from 'react';

import { FormPageLayout, PageLayout } from '@/components';

import { AttendanceLeadDescription } from './components/AttendanceLeadDescription';
import { AttendanceLiveRegion } from './components/AttendanceLiveRegion';
import { AttendancePageContent } from './components/AttendancePageContent';
import { useEventAttendancePage } from './useEventAttendancePage';

export const EventAttendancePage = (): ReactElement => {
  const {
    announcement,
    attendanceQuery,
    attendParticipant,
    canFetchEventAttendance,
    cancelAttendance,
    canceledApplicantsQuery,
    handleBack,
    isUpdatingAttendance,
  } = useEventAttendancePage();

  return (
    <PageLayout background="bg.subtle">
      <FormPageLayout
        description={
          <AttendanceLeadDescription
            canFetchEventAttendance={canFetchEventAttendance}
            isPending={attendanceQuery.isPending}
            summary={attendanceQuery.data?.summary}
          />
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
        <AttendanceLiveRegion>{announcement}</AttendanceLiveRegion>
        <AttendancePageContent
          attendanceData={attendanceQuery.data}
          canFetchEventAttendance={canFetchEventAttendance}
          canceledApplicantsData={canceledApplicantsQuery.data}
          isAttendanceError={attendanceQuery.isError}
          isAttendancePending={attendanceQuery.isPending}
          isCanceledApplicantsError={canceledApplicantsQuery.isError}
          isCanceledApplicantsPending={canceledApplicantsQuery.isPending}
          isUpdatingAttendance={isUpdatingAttendance}
          onAttend={attendParticipant}
          onCancelAttendance={cancelAttendance}
        />
      </FormPageLayout>
    </PageLayout>
  );
};
