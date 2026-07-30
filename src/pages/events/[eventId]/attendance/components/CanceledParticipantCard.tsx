import type { ReactElement } from 'react';

import type { CanceledApplicant } from '@/api/types/application';

import { ParticipantCard } from './ParticipantCard';
import { ParticipantInfo } from './ParticipantInfo';

type CanceledParticipantCardProps = {
  participant: CanceledApplicant;
};

export const CanceledParticipantCard = ({
  participant,
}: CanceledParticipantCardProps): ReactElement => {
  return (
    <ParticipantCard>
      <ParticipantInfo participant={participant} />
    </ParticipantCard>
  );
};
