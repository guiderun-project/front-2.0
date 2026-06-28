import type { ReactElement } from 'react';

import type { AttendanceParticipant } from '@/api/types';
import { Button, HiddenText } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

import { ParticipantCard } from './ParticipantCard';
import { ParticipantInfo } from './ParticipantInfo';

type AttendanceActionStatus = 'waiting' | 'attended';

type ParticipantActionCardProps = {
  disabled: boolean;
  participant: AttendanceParticipant;
  status: AttendanceActionStatus;
  onAction: (participant: AttendanceParticipant) => void;
};

export const ParticipantActionCard = ({
  disabled,
  participant,
  status,
  onAction,
}: ParticipantActionCardProps): ReactElement => {
  const actionLabel = status === 'waiting' ? '출석하기' : '출석취소';
  const actionDescription =
    `${RUNNER_TYPE_LABELS[participant.type]} ${participant.name} ${actionLabel}`;

  return (
    <ParticipantCard>
      <ParticipantInfo participant={participant} />
      <Button
        disabled={disabled}
        level={status === 'waiting' ? 'primary' : 'quaternary'}
        size="s"
        onClick={() => {
          onAction(participant);
        }}
      >
        <HiddenText>{actionDescription}</HiddenText>
        <span aria-hidden={true}>{actionLabel}</span>
      </Button>
    </ParticipantCard>
  );
};
