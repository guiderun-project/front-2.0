import type { ReactElement } from 'react';

import styled from '@emotion/styled';

type MatchLeadDescriptionProps = {
  waitingCount: number;
};

export const MatchLeadDescription = ({
  waitingCount,
}: MatchLeadDescriptionProps): ReactElement => {
  return (
    <>
      현재 <WaitingCount>{waitingCount}명</WaitingCount>이 매칭되지 않았어요
    </>
  );
};

const WaitingCount = styled.span(({ theme }) => ({
  color: theme.color.text.brand,
}));
