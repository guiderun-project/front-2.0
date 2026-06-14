import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MatchingWaitingParticipant } from '@/api/types';
import { Badge, Button, RunnerTypeAvatar, Text } from '@/components';

import { ParticipantAdditionalInfoAccordion } from './ParticipantAdditionalInfoAccordion';

type MatchParticipantCardProps = {
  disabled: boolean;
  isSelected: boolean;
  participant: MatchingWaitingParticipant;
  onToggle: (participant: MatchingWaitingParticipant) => void;
};

const getParticipantMeta = (
  participant: MatchingWaitingParticipant,
): string => {
  const groupText = participant.originalRunningGroup
    ? `기존 ${participant.originalRunningGroup}그룹`
    : '기존 그룹 없음';
  const partnerText = participant.hopePartner
    ? `희망파트너 ${participant.hopePartner}`
    : null;

  return [groupText, partnerText].filter(Boolean).join(' ・');
};

export const MatchParticipantCard = ({
  disabled,
  isSelected,
  participant,
  onToggle,
}: MatchParticipantCardProps): ReactElement => {
  const actionLabel = isSelected ? '취소하기' : '선택하기';

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
            <ParticipantMeta color="text.tertiary" font="body-s-m">
              {getParticipantMeta(participant)}
            </ParticipantMeta>
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
          {actionLabel}
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
