import type { ReactNode } from 'react';

import styled from '@emotion/styled';

type AttendanceLeadDescriptionProps = {
  canFetchEventAttendance: boolean;
  isPending: boolean;
  summary?: {
    attendedCount: number;
    waitingCount: number;
  };
};

export const AttendanceLeadDescription = ({
  canFetchEventAttendance,
  isPending,
  summary,
}: AttendanceLeadDescriptionProps): ReactNode => {
  if (!canFetchEventAttendance) {
    return '이벤트 정보를 확인할 수 없어요';
  }

  if (isPending || !summary) {
    return '출석 정보를 불러오는 중입니다';
  }

  const leadCount = summary.waitingCount;

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
