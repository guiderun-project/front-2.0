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
  const groupText = getOriginalRunningGroupText(
    applicationGroup,
    eventGroupLabelContext,
    participant.originalRunningGroup,
  );
  const partnerText = participant.hopePartner
    ? `희망파트너 ${participant.hopePartner}`
    : null;
  const participantMeta = [groupText, partnerText].filter(Boolean).join(' ・');

  // 카드에 표시된 정보(이름·첫참여·기존그룹·희망파트너·추가코멘트)를 모두
  // 체크박스 접근 가능한 이름으로 묶어, 그룹 라벨을 건너뛰는 iOS VoiceOver에서도
  // 참가자 정보를 한 번에 파악할 수 있게 한다. 선택 여부는 체크박스 checked
  // 상태와 폴라이트 라이브 리전 안내가 전달하므로 이름에 넣지 않는다.
  const selectLabelParts = [
    `${RUNNER_TYPE_LABELS[participant.type]} ${participant.name}`,
    participant.isFirstParticipation ? '첫참여' : null,
    groupText,
    partnerText,
    participant.additionalComment
      ? `추가 코멘트 ${participant.additionalComment}`
      : null,
  ].filter(Boolean);
  const selectLabel = `${selectLabelParts.join(', ')}, 선택`;

  return (
    <ParticipantCard $isSelected={isSelected}>
      <CheckBox
        aria-label={selectLabel}
        checked={isSelected}
        onChange={() => {
          onToggle(participant);
        }}
      />
      {/* 위 체크박스 aria-label이 카드의 모든 정보를 묶어 낭독하므로, 시각 전용
          정보 영역은 스크린리더 중복 낭독을 막기 위해 통째로 숨긴다. */}
      <InfoColumn aria-hidden={true}>
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
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderRadius: theme.radius.lg,
    boxSizing: 'border-box',
    backgroundColor: $isSelected
      ? theme.color.bg['brand-soft']
      : theme.color.bg.subtle,
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    transition: 'background-color 160ms ease-out',

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
