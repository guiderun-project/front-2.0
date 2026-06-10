import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant } from '@/api/types';
import { Button } from '@/components';

import {
  ATTENDANCE_ACTION_LABEL,
  getAttendanceParticipantSummaryLabel,
  PARTICIPANT_ACTION_LABEL,
  PARTICIPANT_STATUS_LABEL,
} from './attendanceLabels';
import { ParticipantInfo } from './ParticipantInfo';

type ParticipantActionCardProps = {
  disabled: boolean;
  onAction: (participant: AttendanceParticipant) => void;
  participant: AttendanceParticipant;
  status: keyof typeof ATTENDANCE_ACTION_LABEL;
};

const getAttendanceActionLabel = (
  participant: AttendanceParticipant,
  status: keyof typeof ATTENDANCE_ACTION_LABEL,
): string =>
  `${getAttendanceParticipantSummaryLabel(participant)}, ${PARTICIPANT_STATUS_LABEL[status]}. ${PARTICIPANT_ACTION_LABEL[status]}`;

export const ParticipantActionCard = ({
  disabled,
  onAction,
  participant,
  status,
}: ParticipantActionCardProps): ReactElement => {
  return (
    <ParticipantCard>
      <ParticipantInfo participant={participant} />
      <Button
        aria-label={getAttendanceActionLabel(participant, status)}
        disabled={disabled}
        level={status === 'waiting' ? 'primary' : 'quaternary'}
        size="s"
        onClick={() => {
          onAction(participant);
        }}
      >
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
