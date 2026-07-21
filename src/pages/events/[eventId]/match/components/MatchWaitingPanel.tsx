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
  eventGroupLabelContext: EventGroupLabelContext;
  selectedUserIds: ReadonlySet<string>;
  waiting: MatchingWaitingResponse;
  onToggleParticipant: (participant: MatchingWaitingParticipant) => void;
};

export const MatchWaitingPanel = ({
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
              <GroupHeading>
                <GroupHeadingText role="text">
                  <Text as="span" color="text.primary" font="body-l-sb">
                    {groupLabel}
                  </Text>{' '}
                  <GroupCountText color="text.tertiary" font="body-m-m">
                    {group.totalCount}명
                  </GroupCountText>
                </GroupHeadingText>
              </GroupHeading>
            </GroupHeader>
            {/* WebKit은 list-style: none인 목록의 list 역할을 제거하므로 role을 명시한다. */}
            <ParticipantList role="list">
              {group.participants.map((participant) => (
                <li key={participant.userId}>
                  <MatchParticipantCard
                    applicationGroup={group.runningGroup}
                    eventGroupLabelContext={eventGroupLabelContext}
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

const GroupHeading = styled.h3({
  margin: 0,
});

const GroupHeadingText = styled.span({
  display: 'inline',
});

const GroupCountText = styled(Text)(({ theme }) => ({
  marginLeft: theme.spacing.md,
}));

const ParticipantList = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));
