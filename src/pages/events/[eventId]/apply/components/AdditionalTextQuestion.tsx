import type { ChangeEvent, ReactElement } from 'react';

import styled from '@emotion/styled';
import { Controller, type Control } from 'react-hook-form';

import type { AdditionalQuestionDetail } from '@/api/types';
import { Text } from '@/components';

import type { EventApplyFormValues } from '../schema';

const ADDITIONAL_TEXT_ANSWER_MAX_LENGTH = 30;

type AdditionalTextQuestionProps = {
  control: Control<EventApplyFormValues>;
  question: Extract<AdditionalQuestionDetail, { type: 'TEXT' }>;
};

export const AdditionalTextQuestion = ({
  control,
  question,
}: AdditionalTextQuestionProps): ReactElement => {
  const inputId = `additional-answer-${question.questionId}`;
  const titleId = `${inputId}-title`;

  return (
    <Controller
      control={control}
      name={`additionalAnswers.${question.questionId}`}
      render={({ field }) => {
        const value = field.value ?? '';
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          field.onChange(
            event.target.value.slice(0, ADDITIONAL_TEXT_ANSWER_MAX_LENGTH),
          );
        };

        return (
          <QuestionField>
            <QuestionCard>
              <QuestionHeader>
                <Text
                  as="h3"
                  color="text.primary"
                  font="body-m-sb"
                  id={titleId}
                >
                  {question.question}
                </Text>
              </QuestionHeader>
              <QuestionBody>
                <AnswerInput
                  ref={field.ref}
                  aria-describedby={`${inputId}-counter`}
                  aria-labelledby={titleId}
                  id={inputId}
                  maxLength={ADDITIONAL_TEXT_ANSWER_MAX_LENGTH}
                  name={field.name}
                  placeholder="답변을 입력해주세요"
                  value={value}
                  onBlur={field.onBlur}
                  onChange={handleChange}
                />
              </QuestionBody>
            </QuestionCard>
            <InformRow>
              <Counter
                aria-label={`${value.length}/${ADDITIONAL_TEXT_ANSWER_MAX_LENGTH}자 입력`}
                aria-live="polite"
                id={`${inputId}-counter`}
              >
                <Text as="span" color="text.brand" font="body-s-m">
                  {value.length}
                </Text>
                <Text as="span" color="text.tertiary" font="body-s-r">
                  /{ADDITIONAL_TEXT_ANSWER_MAX_LENGTH}자
                </Text>
              </Counter>
            </InformRow>
          </QuestionField>
        );
      }}
    />
  );
};

const QuestionField = styled.div(({ theme }) => ({
  display: 'grid',
  width: '100%',
  gap: theme.spacing.md,
}));

const QuestionCard = styled.div(({ theme }) => ({
  display: 'grid',
  width: '100%',
  overflow: 'hidden',
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.md,
  background: theme.color.bg.default,

  '&:focus-within': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const QuestionHeader = styled.div(({ theme }) => ({
  padding: theme.spacing.xl,
  background: theme.color.bg.subtle,
}));

const QuestionBody = styled.div(({ theme }) => ({
  padding: theme.spacing.xl,
}));

const AnswerInput = styled.input(({ theme }) => ({
  ...theme.typography['body-m-m'],
  width: '100%',
  minWidth: 0,
  padding: 0,
  border: 0,
  background: 'transparent',
  color: theme.color.text.primary,
  caretColor: theme.color.text.brand,
  outline: 0,

  '&::placeholder': {
    color: theme.color.text.tertiary,
  },
}));

const InformRow = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
});

const Counter = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing.xs,
}));
