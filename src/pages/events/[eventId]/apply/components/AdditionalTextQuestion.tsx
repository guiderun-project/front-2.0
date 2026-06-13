import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Controller, type Control } from 'react-hook-form';

import type { AdditionalQuestionDetail } from '@/api/types';
import { Input, Text } from '@/components';

import type { EventApplyFormValues } from '../schema';

type AdditionalTextQuestionProps = {
  control: Control<EventApplyFormValues>;
  question: Extract<AdditionalQuestionDetail, { type: 'TEXT' }>;
};

export const AdditionalTextQuestion = ({
  control,
  question,
}: AdditionalTextQuestionProps): ReactElement => {
  return (
    <QuestionCard>
      <QuestionHeader>
        <Text as="h3" color="text.primary" font="body-m-sb">
          {question.question}
        </Text>
      </QuestionHeader>
      <QuestionBody>
        <Controller
          control={control}
          name={`additionalAnswers.${question.questionId}`}
          render={({ field }) => (
            <Input
              label="답변"
              placeholder="답변을 입력해주세요"
              value={field.value ?? ''}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          )}
        />
      </QuestionBody>
    </QuestionCard>
  );
};

const QuestionCard = styled.div(({ theme }) => ({
  display: 'grid',
  width: '100%',
  overflow: 'hidden',
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.md,
  background: theme.color.bg.default,
}));

const QuestionHeader = styled.div(({ theme }) => ({
  padding: theme.spacing.xl,
  background: theme.color.bg.subtle,
}));

const QuestionBody = styled.div(({ theme }) => ({
  padding: theme.spacing.xl,
}));
