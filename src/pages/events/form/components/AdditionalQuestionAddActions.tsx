import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Button } from '@/components';

import type { EventFormValues } from '../schema';

type AdditionalQuestionAddActionsProps = {
  isSelectAddDisabled: boolean;
  isTextAddDisabled: boolean;
  onAddQuestion: (
    type: EventFormValues['additionalQuestions'][number]['type'],
  ) => void;
};

export const AdditionalQuestionAddActions = ({
  isSelectAddDisabled,
  isTextAddDisabled,
  onAddQuestion,
}: AdditionalQuestionAddActionsProps): ReactElement => (
  <AddActions>
    <Button
      disabled={isTextAddDisabled}
      fullWidth
      level="line-type"
      rightIcon={{ icon: 'plus-lined' }}
      size="m"
      type="button"
      onClick={() => onAddQuestion('TEXT')}
    >
      질문 추가
    </Button>
    <Button
      disabled={isSelectAddDisabled}
      fullWidth
      level="line-type"
      rightIcon={{ icon: 'plus-lined' }}
      size="m"
      type="button"
      onClick={() => onAddQuestion('SELECT')}
    >
      설문 추가
    </Button>
  </AddActions>
);

const AddActions = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing.md,
}));
