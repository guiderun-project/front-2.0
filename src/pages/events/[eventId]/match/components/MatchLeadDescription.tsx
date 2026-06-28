import type { ReactElement } from 'react';

import styled from '@emotion/styled';

type MatchLeadDescriptionProps = {
  waitingCount: number;
};

export const MatchLeadDescription = ({
  waitingCount,
}: MatchLeadDescriptionProps): ReactElement => {
  return (
    <LeadText role="text">
      현재 <WaitingCount>{waitingCount}명</WaitingCount>이 매칭되지 않았어요
    </LeadText>
  );
};

const LeadText = styled.span({
  display: 'inline',
});

const WaitingCount = styled.span(({ theme }) => ({
  color: theme.color.text.brand,
}));
