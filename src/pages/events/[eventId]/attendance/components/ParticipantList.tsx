import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { SectionEmptyState } from './AttendanceStates';

type ParticipantListProps<TParticipant extends { userId: string }> = {
  emptyText: string;
  participants: TParticipant[];
  renderParticipant: (participant: TParticipant) => ReactElement;
};

export const ParticipantList = <TParticipant extends { userId: string }>({
  emptyText,
  participants,
  renderParticipant,
}: ParticipantListProps<TParticipant>): ReactElement => {
  if (participants.length === 0) {
    return <SectionEmptyState>{emptyText}</SectionEmptyState>;
  }

  return (
    <List>
      {participants.map((participant) => (
        <li key={participant.userId}>{renderParticipant(participant)}</li>
      ))}
    </List>
  );
};

const List = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));
