import type { ChangeEvent, ReactElement } from 'react';

import styled from '@emotion/styled';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components';

import { ADDITIONAL_SELECT_OPTION_MAX_COUNT } from '../constants';
import type { EventFormValues } from '../schema';

type AdditionalSelectOptionFieldsProps = {
  form: UseFormReturn<EventFormValues>;
  questionIndex: number;
};

export const AdditionalSelectOptionFields = ({
  form,
  questionIndex,
}: AdditionalSelectOptionFieldsProps): ReactElement | null => {
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

const FieldError = styled.p(({ theme }) => ({
  ...theme.typography['body-s-m'],
  minWidth: 0,
  margin: 0,
  color: theme.color.text.danger,
}));
