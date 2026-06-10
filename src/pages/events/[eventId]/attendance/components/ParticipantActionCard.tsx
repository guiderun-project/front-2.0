import { useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant } from '@/api/types';
import { Button, HiddenText } from '@/components';

import { ParticipantInfo } from './ParticipantInfo';

type AttendanceActionStatus = 'waiting' | 'attended';

type ParticipantActionCardProps = {
  disabled: boolean;
  onAction: (participant: AttendanceParticipant) => void;
  participant: AttendanceParticipant;
  status: AttendanceActionStatus;
};

const ATTENDANCE_ACTION_LABEL = {
  waiting: '출석하기',
  attended: '출석취소',
} as const satisfies Record<AttendanceActionStatus, string>;

const PARTICIPANT_STATUS_LABEL = {
  waiting: '출석 대기 상태',
  attended: '출석 완료 상태',
} as const satisfies Record<AttendanceActionStatus, string>;

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
