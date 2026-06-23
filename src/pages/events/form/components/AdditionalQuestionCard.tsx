import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { IconButton, Text } from '@/components';

import { ADDITIONAL_QUESTION_TITLE_MAX_LENGTH } from '../constants';
import type { EventFormValues } from '../schema';
import { AdditionalSelectOptionFields } from './AdditionalSelectOptionFields';

type AdditionalQuestionCardProps = {
  fieldId: string;
  form: UseFormReturn<EventFormValues>;
  questionIndex: number;
  questionType: EventFormValues['additionalQuestions'][number]['type'];
  readOnly?: boolean;
  onRemove: () => void;
};

export const AdditionalQuestionCard = ({
  fieldId,
  form,
  questionIndex,
  questionType,
  readOnly = false,
  onRemove,
}: AdditionalQuestionCardProps): ReactElement => {
  const title = questionType === 'TEXT' ? '질문' : '설문';
  const titleErrorId = `${fieldId}-question-title-error`;

  return (
    <QuestionCard>
      <QuestionCardHeader>
        <Text as="h3" color="text.primary" font="body-m-sb">
          {title}
        </Text>
        {readOnly ? null : (
          <IconButton
            aria-label={`${title} 삭제`}
            color="icon.secondary"
            icon="delete-filled"
            iconSize={24}
            shape="round"
            size={24}
            type="button"
            onClick={onRemove}
          />
        )}
      </QuestionCardHeader>

      <Controller
        control={form.control}
        name={`additionalQuestions.${questionIndex}.title`}
        render={({ field: titleField, fieldState }) => {
          const hasVisibleError = !readOnly && fieldState.invalid;

          return (
            <QuestionTitleField>
              <QuestionTitleInput
                ref={titleField.ref}
                $hasError={hasVisibleError}
                $readOnly={readOnly}
                aria-describedby={
                  !readOnly && fieldState.error ? titleErrorId : undefined
                }
                aria-invalid={hasVisibleError || undefined}
                aria-label={`${title} 내용`}
                maxLength={ADDITIONAL_QUESTION_TITLE_MAX_LENGTH}
                name={titleField.name}
                placeholder="질문을 입력하세요"
                readOnly={readOnly}
                value={titleField.value}
                onBlur={titleField.onBlur}
                onChange={titleField.onChange}
              />
              {readOnly ? null : (
                <InformRow>
                  {fieldState.error ? (
                    <FieldError id={titleErrorId}>
                      {fieldState.error.message}
                    </FieldError>
                  ) : (
                    <span />
                  )}
                  <Counter aria-live="polite">
                    <Text as="span" color="text.brand" font="body-s-m">
                      {titleField.value.length}
                    </Text>
                    <Text as="span" color="text.tertiary" font="body-s-m">
                      /{ADDITIONAL_QUESTION_TITLE_MAX_LENGTH}자
                    </Text>
                  </Counter>
                </InformRow>
              )}
            </QuestionTitleField>
          );
        }}
      />

      {questionType === 'SELECT' ? (
        <AdditionalSelectOptionFields
          form={form}
          questionIndex={questionIndex}
          readOnly={readOnly}
        />
      ) : null}
    </QuestionCard>
  );
};

const QuestionCard = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.md,
  padding: theme.spacing.xl,
  borderRadius: theme.pxToRem(20),
  background: theme.color.bg.subtle,
}));

const QuestionCardHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.md,
}));

const QuestionTitleField = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.md,
}));

const QuestionTitleInput = styled.input<{
  $hasError: boolean;
  $readOnly: boolean;
}>(({ $hasError, $readOnly, theme }) => ({
  ...theme.typography['body-m-m'],
  width: '100%',
  minWidth: 0,
  minHeight: theme.pxToRem(51),
  padding: theme.spacing.xl,
  border: `${theme.pxToRem(1)} solid ${
    $hasError ? theme.color.border.danger : theme.color.border.default
  }`,
  borderRadius: theme.radius.md,
  boxSizing: 'border-box',
  backgroundColor: $readOnly ? theme.color.bg.surface : theme.color.bg.default,
  color: $readOnly ? theme.color.text.tertiary : theme.color.text.primary,
  outline: 0,

  '&::placeholder': {
    color: theme.color.text.tertiary,
  },

  '&:focus': {
    borderColor: $readOnly
      ? theme.color.border.default
      : $hasError
        ? theme.color.border.danger
        : theme.color.border.brand,
  },

  '&:read-only': {
    backgroundColor: theme.color.bg.surface,
    color: theme.color.text.tertiary,
    cursor: 'default',
  },
}));

const InformRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  minHeight: theme.pxToRem(21),
  gap: theme.spacing.md,
}));

const FieldError = styled.p(({ theme }) => ({
  ...theme.typography['body-s-m'],
  minWidth: 0,
  margin: 0,
  color: theme.color.text.danger,
}));

const Counter = styled.span(({ theme }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: theme.spacing.xs,
}));
