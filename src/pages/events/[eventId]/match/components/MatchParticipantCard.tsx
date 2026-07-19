import { Fragment, type ReactElement } from 'react';

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

type AdditionalInfoItem = {
  answer: string;
  title: string;
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

const getAdditionalInfoItems = (
  participant: MatchingWaitingParticipant,
): AdditionalInfoItem[] => {
  const commentItems = participant.additionalComment
    ? [{ answer: participant.additionalComment, title: '추가 코멘트' }]
    : [];
  const answerItems = participant.additionalAnswers
    .filter((answer) => answer.answer)
    .map((answer) => ({
      answer: answer.answer ?? '',
      title: answer.questionTitle,
    }));

  return [...commentItems, ...answerItems];
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
  const infoItems = getAdditionalInfoItems(participant);
  const selectLabel =
    `${RUNNER_TYPE_LABELS[participant.type]} ${participant.name} ${isSelected ? '선택 취소' : '선택'}`;

  return (
    <ParticipantCard $isSelected={isSelected}>
      <CardHeaderLabel>
        <CheckBox
          aria-label={selectLabel}
          checked={isSelected}
          onChange={() => {
            onToggle(participant);
          }}
        />
        <ParticipantInfo>
          <RunnerTypeAvatar size="m" type={participant.type} />
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
      </CardHeaderLabel>

      {isSelected && infoItems.length > 0 ? (
        <CommentSection>
          {infoItems.map((item, index) => (
            <Fragment key={`${item.title}-${index}`}>
              {index > 0 ? <CommentDivider /> : null}
              <CommentItem>
                <Text color="text.quaternary" font="detail-s-sb">
                  {item.title}
                </Text>
                <Text color="text.secondary" font="detail-m-m">
                  {item.answer}
                </Text>
              </CommentItem>
            </Fragment>
          ))}
        </CommentSection>
      ) : null}
    </ParticipantCard>
  );
};

const ParticipantCard = styled.article<{ $isSelected: boolean }>(
  ({ $isSelected, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
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
    transition: 'background-color 160ms ease-out, border-color 160ms ease-out',

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  }),
);

const CardHeaderLabel = styled.label(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.lg,
  width: '100%',
  minWidth: 0,
  cursor: 'pointer',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
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
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});

const ParticipantMeta = styled(Text)({
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const CommentSection = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  width: '100%',
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.elevated,
  boxSizing: 'border-box',
}));

const CommentItem = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const CommentDivider = styled.div(({ theme }) => ({
  width: '100%',
  height: 0,
  borderTop: `1px solid ${theme.color.border.subtle}`,
}));
