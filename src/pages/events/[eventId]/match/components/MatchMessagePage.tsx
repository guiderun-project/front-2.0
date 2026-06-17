import type { ReactElement } from 'react';

import type { MatchMessageState } from '../matchPageState';
import { MatchPageMessageContent } from './MatchPageContent';
import { MatchPageShell } from './MatchPageShell';

type MatchMessagePageProps = {
  pageState: MatchMessageState;
};

export const MatchMessagePage = ({
  pageState,
}: MatchMessagePageProps): ReactElement => {
  return (
    <MatchPageShell>
      <MatchPageMessageContent pageState={pageState} />
    </MatchPageShell>
  );
};
