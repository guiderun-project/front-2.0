import type { ReactNode } from 'react';

import { Text } from '@/components';

import type { AttendancePageState } from '../attendancePageState';

type AttendanceLeadDescriptionProps = {
  pageState: AttendancePageState;
};

export const AttendanceLeadDescription = ({
  pageState,
}: AttendanceLeadDescriptionProps): ReactNode => {
  switch (pageState.status) {
    case 'invalid-event':
    case 'permission-error':
      return '이벤트 정보를 확인할 수 없어요';
    case 'permission-pending':
      return '이벤트 정보를 확인하고 있어요';
    case 'forbidden':
      return '출석 관리는 주최자 또는 관리자만 가능해요';
    case 'attendance-pending':
      return '출석 정보를 불러오고 있어요';
    case 'attendance-error':
      return '출석 정보를 확인할 수 없어요';
    case 'ready':
      break;
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
