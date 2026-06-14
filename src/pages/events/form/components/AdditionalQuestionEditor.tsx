import type { ChangeEvent, ReactElement } from 'react';

import styled from '@emotion/styled';
import {
  Controller,
  useFieldArray,
  useWatch,
  type UseFormReturn,
} from 'react-hook-form';

import { Button, IconButton, Text } from '@/components';

import {
  ADDITIONAL_QUESTION_TITLE_MAX_LENGTH,
  ADDITIONAL_SELECT_OPTION_MAX_COUNT,
  ADDITIONAL_TEXT_QUESTION_MAX_COUNT,
} from '../constants';
import type { EventFormValues } from '../schema';
import { createAdditionalQuestionDraft } from '../utils';

type AdditionalQuestionEditorProps = {
  form: UseFormReturn<EventFormValues>;
};

export const AdditionalQuestionEditor = ({
  form,
}: AdditionalQuestionEditorProps): ReactElement => {
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: 'additionalQuestions',
  });
  const additionalQuestions =
    useWatch({
      control: form.control,
      name: 'additionalQuestions',
    }) ?? [];

  const textQuestionCount = additionalQuestions.filter(
    (question) => question.type === 'TEXT',
  ).length;
  const selectQuestionCount = additionalQuestions.filter(
    (question) => question.type === 'SELECT',
  ).length;
  const isTextAddDisabled =
    textQuestionCount >= ADDITIONAL_TEXT_QUESTION_MAX_COUNT;
  const isSelectAddDisabled = selectQuestionCount >= 1;

  const handleAddQuestion = (
    type: EventFormValues['additionalQuestions'][number]['type'],
  ) => {
    append(createAdditionalQuestionDraft(type));
  };

  return (
    <EditorRoot>
      <EditorHeader>
        <Text as="p" color="text.secondary" font="body-m-m">
          {'확인하고 싶은 질문이나 설문을 추가해보세요.\n각 항목당 하나씩 추가할 수 있어요.'}
        </Text>
        <AddActions>
          <Button
            disabled={isTextAddDisabled}
            fullWidth
            level="line-type"
            rightIcon={{ icon: 'plus-lined' }}
            size="m"
            type="button"
            onClick={() => handleAddQuestion('TEXT')}
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
            onClick={() => handleAddQuestion('SELECT')}
          >
            설문 추가
          </Button>
        </AddActions>
      </EditorHeader>

      {fields.length > 0 ? (
        <QuestionList>
          {fields.map((field, index) => {
            const question = additionalQuestions[index] ?? field;
            const title = question.type === 'TEXT' ? '질문' : '설문';

            return (
              <QuestionCard key={field.id}>
                <QuestionCardHeader>
                  <Text as="h3" color="text.primary" font="body-m-sb">
                    {title}
                  </Text>
                  <IconButton
                    aria-label={`${title} 삭제`}
                    color="icon.secondary"
                    icon="delete-lined"
                    iconSize={24}
                    size={24}
                    type="button"
                    onClick={() => remove(index)}
                  />
                </QuestionCardHeader>

                <Controller
                  control={form.control}
                  name={`additionalQuestions.${index}.title`}
                  render={({ field: titleField, fieldState }) => (
                    <QuestionTitleField>
                      <QuestionTitleInput
                        ref={titleField.ref}
                        $hasError={fieldState.invalid}
                        aria-describedby={
                          fieldState.error
                            ? `${field.id}-question-title-error`
                            : undefined
                        }
                        aria-invalid={fieldState.invalid}
                        aria-label={`${title} 내용`}
                        maxLength={ADDITIONAL_QUESTION_TITLE_MAX_LENGTH}
                        name={titleField.name}
                        placeholder="질문을 입력하세요"
                        value={titleField.value}
                        onBlur={titleField.onBlur}
                        onChange={titleField.onChange}
                      />
                      <InformRow>
                        {fieldState.error ? (
                          <FieldError id={`${field.id}-question-title-error`}>
                            {fieldState.error.message}
                          </FieldError>
                        ) : (
                          <span />
                        )}
                        <Counter aria-live="polite">
                          <Text as="span" color="text.brand" font="body-s-m">
                            {titleField.value.length}
                          </Text>
                          <Text
                            as="span"
                            color="text.tertiary"
                            font="body-s-m"
                          >
                            /{ADDITIONAL_QUESTION_TITLE_MAX_LENGTH}자
                          </Text>
                        </Counter>
                      </InformRow>
                    </QuestionTitleField>
                  )}
                />

                {question.type === 'SELECT' ? (
                  <SelectOptionFields form={form} questionIndex={index} />
                ) : null}
              </QuestionCard>
            );
          })}
        </QuestionList>
      ) : null}
    </EditorRoot>
  );
};

type SelectOptionFieldsProps = {
  form: UseFormReturn<EventFormValues>;
  questionIndex: number;
};

const SelectOptionFields = ({
  form,
  questionIndex,
}: SelectOptionFieldsProps): ReactElement | null => {
  const options =
    useWatch({
      control: form.control,
      name: `additionalQuestions.${questionIndex}.options`,
    }) ?? [];

  if (!Array.isArray(options)) {
    return null;
  }

  const handleAddOption = () => {
    if (options.length >= ADDITIONAL_SELECT_OPTION_MAX_COUNT) {
      return;
    }

    form.setValue(
      `additionalQuestions.${questionIndex}.options`,
      [...options, ''],
      { shouldDirty: true, shouldTouch: true, shouldValidate: false },
    );
  };

  return (
    <OptionGroup>
      <OptionList>
        {options.map((_, optionIndex) => (
          <Controller
            key={optionIndex}
            control={form.control}
            name={`additionalQuestions.${questionIndex}.options.${optionIndex}`}
            render={({ field, fieldState }) => {
              const handleOptionChange = (
                event: ChangeEvent<HTMLInputElement>,
              ) => {
                form.setValue(field.name, event.target.value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: Boolean(fieldState.error),
                });
              };

              return (
                <OptionField>
                  <OptionInput
                    ref={field.ref}
                    $hasError={fieldState.invalid}
                    aria-describedby={
                      fieldState.error
                        ? `select-option-${questionIndex}-${optionIndex}-error`
                        : undefined
                    }
                    aria-invalid={fieldState.invalid}
                    aria-label={`선택지 ${optionIndex + 1}`}
                    name={field.name}
                    placeholder="선택지를 입력하세요"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={handleOptionChange}
                  />
                  {fieldState.error ? (
                    <FieldError
                      id={`select-option-${questionIndex}-${optionIndex}-error`}
                    >
                      {fieldState.error.message}
                    </FieldError>
                  ) : null}
                </OptionField>
              );
            }}
          />
        ))}
      </OptionList>
      <Button
        disabled={options.length >= ADDITIONAL_SELECT_OPTION_MAX_COUNT}
        fullWidth
        level="quaternary"
        rightIcon={{ icon: 'plus-lined' }}
        size="m"
        type="button"
        onClick={handleAddOption}
      >
        항목 추가하기
      </Button>
    </OptionGroup>
  );
};

const EditorRoot = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.lg,
}));

const EditorHeader = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.lg,

  '& p': {
    whiteSpace: 'pre-line',
  },
}));

const AddActions = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing.md,
}));

const QuestionList = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.lg,
}));

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

const QuestionTitleInput = styled.input<{ $hasError: boolean }>(
  ({ $hasError, theme }) => ({
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
    backgroundColor: theme.color.bg.default,
    color: theme.color.text.primary,
    outline: 0,

    '&::placeholder': {
      color: theme.color.text.tertiary,
    },

    '&:focus': {
      borderColor: $hasError
        ? theme.color.border.danger
        : theme.color.border.brand,
    },
  }),
);

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

const OptionGroup = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.md,
}));

const OptionList = styled.div(({ theme }) => ({
  overflow: 'hidden',
  width: '100%',
  border: `${theme.pxToRem(1)} solid ${theme.color.border.default}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.default,
}));

const OptionField = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.s,
  minHeight: theme.pxToRem(51),
  padding: theme.spacing.xl,
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.default,

  '& + &': {
    borderTop: `${theme.pxToRem(1)} solid ${theme.color.border.default}`,
  },
}));

const OptionInput = styled.input<{ $hasError: boolean }>(
  ({ $hasError, theme }) => ({
    ...theme.typography['body-m-m'],
    width: '100%',
    minWidth: 0,
    padding: 0,
    border: 0,
    backgroundColor: 'transparent',
    color: $hasError ? theme.color.text.danger : theme.color.text.primary,
    outline: 0,

    '&::placeholder': {
      color: theme.color.text.tertiary,
    },
  }),
);
