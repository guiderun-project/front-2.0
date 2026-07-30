import type { ReactElement } from 'react';

import type { AttendanceParticipant } from '@/api/types';
import { Button, HiddenText } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

import { ParticipantCard } from './ParticipantCard';
import { ParticipantInfo } from './ParticipantInfo';

type AttendanceActionStatus = 'waiting' | 'attended';

type ParticipantActionCardProps = {
  isUpdating?: boolean;
  participant: AttendanceParticipant;
  status: AttendanceActionStatus;
  onAction: (participant: AttendanceParticipant) => void;
};

export const ParticipantActionCard = ({
  isUpdating = false,
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
      {/* 처리 중에는 disabled 대신 aria-disabled로 상태만 전달해 시각
          스타일과 포커스를 유지한다. 중복 탭 차단은 훅에서 처리한다. */}
      <Button
        aria-disabled={isUpdating || undefined}
        data-attendance-action={status}
        data-user-id={participant.userId}
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
