import { useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant } from '@/api/types';
import { Button, HiddenText } from '@/components';

import {
  ATTENDANCE_ACTION_LABEL,
  PARTICIPANT_STATUS_LABEL,
} from './attendanceLabels';
import { ParticipantInfo } from './ParticipantInfo';

type ParticipantActionCardProps = {
  disabled: boolean;
  onAction: (participant: AttendanceParticipant) => void;
  participant: AttendanceParticipant;
  status: keyof typeof ATTENDANCE_ACTION_LABEL;
};

export const ParticipantActionCard = ({
  disabled,
  onAction,
  participant,
  status,
}: ParticipantActionCardProps): ReactElement => {
  const participantInfoId = useId();

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
        <HiddenText>{PARTICIPANT_STATUS_LABEL[status]}. </HiddenText>
        {ATTENDANCE_ACTION_LABEL[status]}
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
