import { useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant } from '@/api/types';
import { Button } from '@/components';

import { ParticipantInfo } from './ParticipantInfo';

type AttendanceActionStatus = 'waiting' | 'attended';

type ParticipantActionCardProps = {
  disabled: boolean;
  onAction: (participant: AttendanceParticipant) => void;
  participant: AttendanceParticipant;
  status: AttendanceActionStatus;
};

export const ParticipantActionCard = ({
  disabled,
  onAction,
  participant,
  status,
}: ParticipantActionCardProps): ReactElement => {
  const participantInfoId = useId();
  const actionLabel = status === 'waiting' ? '출석하기' : '출석취소';

  return (
    <ParticipantCard>
      <ParticipantInfo id={participantInfoId} participant={participant} />
      <Button
        aria-describedby={participantInfoId}
        disabled={disabled}
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

const ParticipantCard = styled.article(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.lg,
  width: '100%',
  minWidth: 0,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.subtle,
}));
