import type { ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

type ParticipantCardProps = {
  children: ReactNode;
};

export const ParticipantCard = ({
  children,
}: ParticipantCardProps): ReactElement => {
  return <ParticipantCardRoot>{children}</ParticipantCardRoot>;
};

const ParticipantCardRoot = styled.article(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.lg,
  width: '100%',
  minWidth: 0,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.subtle,
}));
