import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Controller, type Control } from 'react-hook-form';

import type { AdditionalQuestionDetail } from '@/api/types';
import { Radio, Text } from '@/components';

import type { EventApplyFormValues } from '../schema';

type AdditionalSelectQuestionProps = {
  control: Control<EventApplyFormValues>;
  question: Extract<AdditionalQuestionDetail, { type: 'SELECT' }>;
};

export const AdditionalSelectQuestion = ({
  control,
  question,
}: AdditionalSelectQuestionProps): ReactElement => {
  return (
    <QuestionCard>
      <QuestionHeader>
        <Text as="h3" color="text.primary" font="body-m-sb">
          {question.question}
        </Text>
      </QuestionHeader>
      <Controller
        control={control}
        name={`additionalAnswers.${question.questionId}`}
        render={({ field }) => (
          <OptionList aria-label={question.question} role="radiogroup">
            {question.options.map((option) => {
              const optionValue = String(option.optionId);
              const isSelected = field.value === optionValue;

              return (
                <OptionLabel
                  key={option.optionId}
                  $selected={isSelected}
                >
                  <Radio
                    checked={isSelected}
                    name={field.name}
                    value={optionValue}
                    onBlur={field.onBlur}
                    onChange={() => field.onChange(optionValue)}
                  />
                  <Text color="text.primary" font="body-m-m">
                    {option.value}
                  </Text>
                </OptionLabel>
              );
            })}
          </OptionList>
        )}
      />
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

const OptionList = styled.div({
  display: 'grid',
});

const OptionLabel = styled.label<{ $selected: boolean }>(({ theme, $selected }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: theme.pxToRem(56),
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  borderTop: `1px solid ${theme.color.border.subtle}`,
  background: $selected ? theme.color.bg['brand-soft'] : theme.color.bg.default,
  cursor: 'pointer',
  transition: 'background-color 120ms ease, transform 120ms ease',

  '&:first-of-type': {
    borderTop: 0,
  },

  '&:active': {
    transform: 'scale(0.99)',
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',

    '&:active': {
      transform: 'none',
    },
  },
}));
