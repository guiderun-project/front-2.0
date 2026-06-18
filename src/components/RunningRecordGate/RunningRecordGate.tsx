import type { ReactElement } from 'react';

import { useMissingRunningDistance } from './hooks/useMissingRunningDistance';
import { RunningRecordSheet } from './RunningRecordSheet';

export const RunningRecordGate = (): ReactElement | null => {
  const { data } = useMissingRunningDistance();

  const target = data?.items[0];

  if (!target) {
    return null;
  }

  return (
    <RunningRecordSheet eventId={target.eventId} eventName={target.name} />
  );
};
