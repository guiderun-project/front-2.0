import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { CanceledApplicant } from '@/api/types/application';

import { getAttendanceParticipantSummaryLabel } from './attendanceLabels';
import { ParticipantInfo } from './ParticipantInfo';

type CanceledParticipantCardProps = {
  participant: CanceledApplicant;
};

export const CanceledParticipantCard = ({
  participant,
}: CanceledParticipantCardProps): ReactElement => {
  return (
    <CanceledCard aria-label={getAttendanceParticipantSummaryLabel(participant)}>
      <ParticipantInfo participant={participant} />
    </CanceledCard>
  );
};

const CanceledCard = styled.article(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: theme.pxToRem(48),
  width: '100%',
  minWidth: 0,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.md,
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.surface,
}));
