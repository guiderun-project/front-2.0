import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant } from '@/api/types';
import { Badge, HiddenText, RunnerTypeAvatar, Text } from '@/components';

type ParticipantInfoData = Pick<AttendanceParticipant, 'name' | 'type'> & {
  isFirstParticipation?: boolean;
};

type ParticipantInfoProps = {
  id?: string;
  participant: ParticipantInfoData;
};

const RUNNER_TYPE_LABEL = {
  VI: '시각장애러너',
  GUIDE: '가이드러너',
} as const satisfies Record<ParticipantInfoData['type'], string>;

export const ParticipantInfo = ({
  id,
  participant,
}: ParticipantInfoProps): ReactElement => {
  return (
    <ParticipantInfoRoot id={id}>
      <AvatarSlot aria-hidden={true}>
        <RunnerTypeAvatar
          size="m"
          type={participant.type}
        />
      </AvatarSlot>
      <ParticipantName color="text.primary" font="body-m-sb">
        {participant.name}
      </ParticipantName>
      <HiddenText>{RUNNER_TYPE_LABEL[participant.type]}</HiddenText>
      {participant.isFirstParticipation ? (
        <Badge size="s" tone="cyan">
          첫참여
        </Badge>
      ) : null}
    </ParticipantInfoRoot>
  );
};

const ParticipantInfoRoot = styled.span(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 0',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const AvatarSlot = styled.span({
  display: 'inline-flex',
  flex: '0 0 auto',
});

const ParticipantName = styled(Text)({
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
