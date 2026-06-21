import { useId, type ReactElement } from 'react';

import type { AttendanceParticipant } from '@/api/types';
import { Button } from '@/components';

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
  const participantInfoId = useId();
  const actionLabel = status === 'waiting' ? '출석하기' : '출석취소';

  return (
    <ParticipantCard>
      <ParticipantInfo id={participantInfoId} participant={participant} />
      <Button
        disabled={disabled}
        aria-describedby={participantInfoId}
        level={status === 'waiting' ? 'primary' : 'quaternary'}
        size="s"
        onClick={() => {
          onAction(participant);
        }}
      >
        {actionLabel}
      </Button>
    </ParticipantCard>
  );
};
