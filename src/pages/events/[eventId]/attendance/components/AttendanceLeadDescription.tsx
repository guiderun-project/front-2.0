import type { ReactNode } from 'react';

import { Text } from '@/components';

import type { AttendancePageState } from '../attendancePageState';

type AttendanceLeadDescriptionProps = {
  pageState: AttendancePageState;
};

export const AttendanceLeadDescription = ({
  pageState,
}: AttendanceLeadDescriptionProps): ReactNode => {
  if (pageState.status === 'message') {
    return pageState.message;
  }

  const leadCount = pageState.attendance.summary.waitingCount;

  return (
    <Text as="span" color="text.tertiary" font="body-m-sb">
      현재{' '}
      <Text as="span" color="text.brand" font="body-m-sb">
        {leadCount}명
      </Text>
      이 출석 대기중이에요
    </Text>
  );
};
