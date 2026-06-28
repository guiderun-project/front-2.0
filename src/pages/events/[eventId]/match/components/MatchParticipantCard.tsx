import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { EVENT_CATEGORIES, EVENT_TYPES } from '@/api/constants';
import type { MatchingWaitingParticipant, RunningGroup } from '@/api/types';
import { Badge, Button, HiddenText, RunnerTypeAvatar, Text } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

import type { EventGroupLabelContext } from '../../utils';
import { ParticipantAdditionalInfoAccordion } from './ParticipantAdditionalInfoAccordion';

type MatchParticipantCardProps = {
  applicationGroup: RunningGroup;
  disabled: boolean;
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
  {
    eventCategory,
    eventType,
  }: EventGroupLabelContext,
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
  disabled,
  eventGroupLabelContext,
  isSelected,
  participant,
  onToggle,
}: MatchParticipantCardProps): ReactElement => {
  const actionLabel = isSelected ? '취소하기' : '선택하기';
  const actionDescription =
    `${RUNNER_TYPE_LABELS[participant.type]} ${participant.name} ${actionLabel}`;
  const participantMeta = getParticipantMeta(
    applicationGroup,
    eventGroupLabelContext,
    participant,
  );

  return (
    <ParticipantCard $isSelected={isSelected}>
      <CardHeader>
        <ParticipantInfo>
          <RunnerTypeAvatar
            size="m"
            type={participant.type}
          />
          <InfoTextGroup>
            <NameRow>
              <ParticipantName color="text.primary" font="body-m-sb">
                {participant.name}
              </ParticipantName>
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
          </InfoTextGroup>
        </ParticipantInfo>
        <SelectButton
          disabled={disabled}
          level={isSelected ? 'quaternary' : 'primary'}
          size="s"
          type="button"
          onClick={() => {
            onToggle(participant);
          }}
        >
          <HiddenText>{actionDescription}</HiddenText>
          <span aria-hidden={true}>{actionLabel}</span>
        </SelectButton>
      </CardHeader>
      <ParticipantAdditionalInfoAccordion participant={participant} />
    </ParticipantCard>
  );
};

const ParticipantCard = styled.article<{ $isSelected: boolean }>(
  ({ $isSelected, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
    width: '100%',
    minWidth: 0,
    padding: theme.spacing.lg,
    border: `${theme.pxToRem(2)} solid ${
      $isSelected ? theme.color.border.focused : 'transparent'
    }`,
    borderRadius: theme.radius.lg,
    boxSizing: 'border-box',
    backgroundColor: $isSelected
      ? theme.color.bg['brand-soft']
      : theme.color.bg.subtle,
    transition:
      'background-color 160ms ease-out, border-color 160ms ease-out',

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  }),
);

const CardHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.lg,
  width: '100%',
  minWidth: 0,
}));

const ParticipantInfo = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 auto',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const InfoTextGroup = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing.xs,
  minWidth: 0,
}));

const NameRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const ParticipantName = styled(Text)({
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const ParticipantMeta = styled(Text)({
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const SelectButton = styled(Button)({
  flex: '0 0 auto',
});
