import type { ReactNode } from 'react';

import styled from '@emotion/styled';

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
      return '이벤트 정보를 확인하는 중입니다';
    case 'forbidden':
      return '출석 관리는 주최자 또는 관리자만 가능해요';
    case 'attendance-pending':
      return '출석 정보를 불러오는 중입니다';
    case 'attendance-error':
      return '출석 정보를 확인할 수 없어요';
    case 'ready':
      break;
  }

  const leadCount = pageState.attendance.summary.waitingCount;

  return (
    <LeadText aria-label={`현재 ${leadCount}명이 출석 대기중이에요`}>
      <span>현재</span>
      <LeadCount>{leadCount}명</LeadCount>
      <span>이 출석 대기중이에요</span>
    </LeadText>
  );
};

const LeadText = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing.s,
  color: theme.color.text.tertiary,
  fontWeight: theme.fontWeight.semibold,
  whiteSpace: 'normal',
}));

const LeadCount = styled.span(({ theme }) => ({
  color: theme.color.text.brand,
}));
