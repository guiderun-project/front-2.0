import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant } from '@/api/types';
import { Badge, HiddenText, RunnerTypeAvatar, Text } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

type ParticipantInfoData = Pick<AttendanceParticipant, 'name' | 'type'> & {
  isFirstParticipation?: boolean;
};

type ParticipantInfoProps = {
  id?: string;
  participant: ParticipantInfoData;
};

export const ParticipantInfo = ({
  id,
  participant,
}: ParticipantInfoProps): ReactElement => {
  const description = getParticipantDescription(participant);

  return (
    <ParticipantInfoRoot id={id}>
      <HiddenText>{description}</HiddenText>
      <ParticipantInfoVisual aria-hidden={true}>
        <AvatarSlot>
          <RunnerTypeAvatar
            size="m"
            type={participant.type}
          />
        </AvatarSlot>
        <ParticipantName color="text.primary" font="body-m-sb">
          {participant.name}
        </ParticipantName>
        {participant.isFirstParticipation ? (
          <Badge size="s" tone="cyan">
            첫참여
          </Badge>
        ) : null}
      </ParticipantInfoVisual>
    </ParticipantInfoRoot>
  );
};

const getParticipantDescription = (participant: ParticipantInfoData) => {
  const participationDescription = participant.isFirstParticipation
    ? ', 첫참여'
    : '';

  return `${RUNNER_TYPE_LABELS[participant.type]} ${participant.name}${participationDescription}`;
};

const ParticipantInfoRoot = styled.span({
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 0',
  minWidth: 0,
});

const ParticipantInfoVisual = styled.span(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
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
