import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { EVENT_CATEGORIES, EVENT_TYPES } from '@/api/constants';
import type { MatchingWaitingParticipant, RunningGroup } from '@/api/types';
import { Badge, CheckBox, RunnerTypeAvatar, Text } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

import type { EventGroupLabelContext } from '../../utils';

type MatchParticipantCardProps = {
  applicationGroup: RunningGroup;
  eventGroupLabelContext: EventGroupLabelContext;
  isSelected: boolean;
  participant: MatchingWaitingParticipant;
  onToggle: (participant: MatchingWaitingParticipant) => void;
};

const getParticipantMeta = (
  applicationGroup: RunningGroup,
  eventGroupLabelContext: EventGroupLabelContext,
  participant: MatchingWaitingParticipant,
): string => {
  const groupText = getOriginalRunningGroupText(
    applicationGroup,
    eventGroupLabelContext,
    participant.originalRunningGroup,
  );
  const partnerText = participant.hopePartner
    ? `희망파트너 ${participant.hopePartner}`
    : null;

  return [groupText, partnerText].filter(Boolean).join(' ・');
};

const getOriginalRunningGroupText = (
  applicationGroup: RunningGroup,
  { eventCategory, eventType }: EventGroupLabelContext,
  originalRunningGroup: RunningGroup | null,
): string | null => {
  const shouldAlwaysShow =
    eventType === EVENT_TYPES.COMPETITION ||
    eventCategory === EVENT_CATEGORIES.GROUP;

  if (shouldAlwaysShow) {
    return originalRunningGroup ? `기존 ${originalRunningGroup}그룹` : null;
  }

  return originalRunningGroup && originalRunningGroup !== applicationGroup
    ? `기존 ${originalRunningGroup}그룹`
    : null;
};

export const MatchParticipantCard = ({
  applicationGroup,
  eventGroupLabelContext,
  isSelected,
  participant,
  onToggle,
}: MatchParticipantCardProps): ReactElement => {
  const participantMeta = getParticipantMeta(
    applicationGroup,
    eventGroupLabelContext,
    participant,
  );
  const selectLabel =
    `${RUNNER_TYPE_LABELS[participant.type]} ${participant.name} ${isSelected ? '선택 취소' : '선택'}`;

  return (
    <ParticipantCard $isSelected={isSelected}>
      <CheckBox
        aria-label={selectLabel}
        checked={isSelected}
        onChange={() => {
          onToggle(participant);
        }}
      />
      <InfoColumn>
        <Profile>
          <NameRow>
            <AvatarNameGroup>
              <RunnerTypeAvatar size="m" type={participant.type} />
              <ParticipantName color="text.primary" font="body-m-sb">
                {participant.name}
              </ParticipantName>
            </AvatarNameGroup>
            {participant.isFirstParticipation ? (
              <Badge size="s" tone="cyan">
                첫참여
              </Badge>
            ) : null}
          </NameRow>
          {participantMeta ? (
            <ParticipantMeta color="text.tertiary" font="body-s-m">
              {participantMeta}
            </ParticipantMeta>
          ) : null}
        </Profile>

        {participant.additionalComment ? (
          <CommentBox>
            <Text color="text.tertiary" font="body-s-m">
              {participant.additionalComment}
            </Text>
          </CommentBox>
        ) : null}
      </InfoColumn>
    </ParticipantCard>
  );
};

const ParticipantCard = styled.label<{ $isSelected: boolean }>(
  ({ $isSelected, theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg,
    width: '100%',
    minWidth: 0,
    padding: `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.xl}`,
    border: `${theme.pxToRem(2)} solid ${
      $isSelected ? theme.color.border.focused : 'transparent'
    }`,
    borderRadius: theme.radius.lg,
    boxSizing: 'border-box',
    backgroundColor: $isSelected
      ? theme.color.bg['brand-soft']
      : theme.color.bg.subtle,
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    transition: 'background-color 160ms ease-out, border-color 160ms ease-out',

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  }),
);

const InfoColumn = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing.sm,
  minWidth: 0,
}));

const Profile = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const NameRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const AvatarNameGroup = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const ParticipantName = styled(Text)({
  display: 'block',
  minWidth: 0,
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});

const ParticipantMeta = styled(Text)({
  display: 'block',
  minWidth: 0,
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});

const CommentBox = styled.div(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.color.bg.surface,
  boxSizing: 'border-box',
}));
