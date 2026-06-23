import type { ChangeEvent, ReactElement } from 'react';

import styled from '@emotion/styled';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';

import { Button, IconButton } from '@/components';

import {
  ADDITIONAL_SELECT_OPTION_DELETABLE_START_INDEX,
  ADDITIONAL_SELECT_OPTION_MAX_COUNT,
} from '../constants';
import type { EventFormValues } from '../schema';

type AdditionalSelectOptionFieldsProps = {
  form: UseFormReturn<EventFormValues>;
  questionIndex: number;
  readOnly?: boolean;
};

export const AdditionalSelectOptionFields = ({
  form,
  questionIndex,
  readOnly = false,
}: AdditionalSelectOptionFieldsProps): ReactElement | null => {
  const options =
    useWatch({
      control: form.control,
      name: `additionalQuestions.${questionIndex}.options`,
    }) ?? [];

  if (!Array.isArray(options)) {
    return null;
  }

  const isAddOptionDisabled =
    options.length >= ADDITIONAL_SELECT_OPTION_MAX_COUNT;

  const handleAddOption = () => {
    if (readOnly || isAddOptionDisabled) {
      return;
    }

    form.setValue(
      `additionalQuestions.${questionIndex}.options`,
      [...options, ''],
      { shouldDirty: true, shouldTouch: true, shouldValidate: false },
    );
  };
  const handleRemoveOption = (optionIndex: number) => {
    if (
      readOnly ||
      optionIndex < ADDITIONAL_SELECT_OPTION_DELETABLE_START_INDEX
    ) {
      return;
    }

    form.setValue(
      `additionalQuestions.${questionIndex}.options`,
      options.filter((_, currentIndex) => currentIndex !== optionIndex),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  };

  return (
    <OptionGroup>
      <OptionList $readOnly={readOnly}>
        {options.map((_, optionIndex) => (
          <Controller
            key={optionIndex}
            control={form.control}
            name={`additionalQuestions.${questionIndex}.options.${optionIndex}`}
            render={({ field, fieldState }) => {
              const hasVisibleError = !readOnly && fieldState.invalid;
              const canDeleteOption =
                !readOnly &&
                optionIndex >= ADDITIONAL_SELECT_OPTION_DELETABLE_START_INDEX;
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
                <OptionField $readOnly={readOnly}>
                  <OptionControlRow>
                    <OptionInput
                      ref={field.ref}
                      $hasError={hasVisibleError}
                      $readOnly={readOnly}
                      aria-describedby={
                        !readOnly && fieldState.error
                          ? `select-option-${questionIndex}-${optionIndex}-error`
                          : undefined
                      }
                      aria-invalid={hasVisibleError || undefined}
                      aria-label={`선택지 ${optionIndex + 1}`}
                      name={field.name}
                      placeholder="선택지를 입력하세요"
                      readOnly={readOnly}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={handleOptionChange}
                    />
                    {canDeleteOption ? (
                      <IconButton
                        aria-label={`선택지 ${optionIndex + 1} 삭제`}
                        color="icon.secondary"
                        icon="delete-filled"
                        iconSize={24}
                        shape="round"
                        size={24}
                        type="button"
                        onClick={() => handleRemoveOption(optionIndex)}
                      />
                    ) : null}
                  </OptionControlRow>
                  {!readOnly && fieldState.error ? (
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
      {readOnly ? null : (
        <Button
          disabled={isAddOptionDisabled}
          fullWidth
          level="quaternary"
          rightIcon={{ icon: 'plus-lined' }}
          size="m"
          type="button"
          onClick={handleAddOption}
        >
          항목 추가하기
        </Button>
      )}
    </OptionGroup>
  );
};

const OptionGroup = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.md,
}));

const OptionList = styled.div<{ $readOnly: boolean }>(
  ({ $readOnly, theme }) => ({
    overflow: 'hidden',
    width: '100%',
    border: `${theme.pxToRem(1)} solid ${theme.color.border.default}`,
    borderRadius: theme.radius.md,
    backgroundColor: $readOnly
      ? theme.color.bg.surface
      : theme.color.bg.default,
  }),
);

const OptionField = styled.div<{ $readOnly: boolean }>(
  ({ $readOnly, theme }) => ({
    display: 'grid',
    gap: theme.spacing.s,
    minHeight: theme.pxToRem(51),
    padding: theme.spacing.xl,
    boxSizing: 'border-box',
    backgroundColor: $readOnly
      ? theme.color.bg.surface
      : theme.color.bg.default,

    '& + &': {
      borderTop: `${theme.pxToRem(1)} solid ${theme.color.border.default}`,
    },
  }),
);

const OptionControlRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
}));

const OptionInput = styled.input<{
  $hasError: boolean;
  $readOnly: boolean;
}>(({ $hasError, $readOnly, theme }) => ({
  ...theme.typography['body-m-m'],
  width: '100%',
  minWidth: 0,
  padding: 0,
  border: 0,
  backgroundColor: 'transparent',
  color: $hasError
    ? theme.color.text.danger
    : $readOnly
      ? theme.color.text.tertiary
      : theme.color.text.primary,
  outline: 0,

  '&::placeholder': {
    color: theme.color.text.tertiary,
  },

  '&:read-only': {
    color: theme.color.text.tertiary,
    cursor: 'default',
  },
}));

const FieldError = styled.p(({ theme }) => ({
  ...theme.typography['body-s-m'],
  minWidth: 0,
  margin: 0,
  color: theme.color.text.danger,
}));
