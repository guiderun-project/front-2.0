import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type {
  MatchingWaitingParticipant,
  MatchingWaitingResponse,
} from '@/api/types';
import { Text } from '@/components';

import {
  getEventGroupDisplayLabel,
  type EventGroupLabelContext,
} from '../../utils';
import { MatchParticipantCard } from './MatchParticipantCard';
import { AllMatchedState } from './MatchStates';

type MatchWaitingPanelProps = {
  disabledParticipantAction: boolean;
  eventGroupLabelContext: EventGroupLabelContext;
  selectedUserIds: ReadonlySet<string>;
  waiting: MatchingWaitingResponse;
  onToggleParticipant: (participant: MatchingWaitingParticipant) => void;
};

export const MatchWaitingPanel = ({
  disabledParticipantAction,
  eventGroupLabelContext,
  selectedUserIds,
  waiting,
  onToggleParticipant,
}: MatchWaitingPanelProps): ReactElement => {
  if (waiting.summary.waitingCount === 0) {
    return <AllMatchedState />;
  }

  return (
    <GroupStack>
      {waiting.groups.map((group, index) => {
        const groupLabel = getEventGroupDisplayLabel(
          eventGroupLabelContext,
          group.runningGroup,
        );

        return (
          <GroupSection key={group.runningGroup} $hasDivider={index > 0}>
            <GroupHeader>
              <Text as="h2" color="text.primary" font="body-l-sb">
                {groupLabel}
              </Text>
              <Text color="text.tertiary" font="body-m-m">
                {group.totalCount}명
              </Text>
            </GroupHeader>
            <ParticipantList>
              {group.participants.map((participant) => (
                <li key={participant.userId}>
                  <MatchParticipantCard
                    disabled={disabledParticipantAction}
                    isSelected={selectedUserIds.has(participant.userId)}
                    participant={participant}
                    onToggle={onToggleParticipant}
                  />
                </li>
              ))}
            </ParticipantList>
          </GroupSection>
        );
      })}
    </GroupStack>
  );
};

const GroupStack = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['2xl'],
}));

const GroupSection = styled.section<{ $hasDivider: boolean }>(
  ({ $hasDivider, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    paddingTop: $hasDivider ? theme.spacing['2xl'] : theme.spacing.lg,
    borderTop: $hasDivider ? `1px solid ${theme.color.border.subtle}` : 0,
  }),
);

const GroupHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const ParticipantList = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));
