import type { ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '@/components';
import { RUNNER_TYPE } from '@/constants';
import {
  BIRTH_DATE_MAX_LENGTH,
  formatBirthDateInput,
  PHONE_DIGIT_LENGTH,
} from '@/utils';

import { SIGNUP_FIELD } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { StepLayout } from '@/pages/signup/components/StepLayout';

export const BasicInfoStep = (): ReactElement => {
  const { control, watch } = useFormContext<SignupFormValues>();
  const isGuide = watch(SIGNUP_FIELD.DISABILITY_TYPE) === RUNNER_TYPE.GUIDE;

  return (
    <StepLayout title={SIGNUP_COPY.basicInfo.title}>
      <Controller
        control={control}
        name={SIGNUP_FIELD.NAME}
        render={({ field, fieldState }) => (
          <Input
            error={Boolean(fieldState.error)}
            errorText={fieldState.error?.message}
            label="이름"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name={SIGNUP_FIELD.BIRTH_DATE}
        render={({ field, fieldState }) => (
          <Input
            error={Boolean(fieldState.error)}
            errorText={fieldState.error?.message}
            inputMode="numeric"
            label="생년월일"
            maxLength={BIRTH_DATE_MAX_LENGTH}
            value={field.value}
            onChange={(event) =>
              field.onChange(formatBirthDateInput(event.target.value))
            }
          />
        )}
      />
      <Controller
        control={control}
        name={SIGNUP_FIELD.PHONE_NUMBER}
        render={({ field, fieldState }) => (
          <Input
            error={Boolean(fieldState.error)}
            errorText={fieldState.error?.message}
            inputMode="numeric"
            label="전화번호"
            maxLength={PHONE_DIGIT_LENGTH}
            value={field.value}
            onChange={(event) =>
              field.onChange(event.target.value.replace(/\D/g, '').slice(0, PHONE_DIGIT_LENGTH))
            }
          />
        )}
      />
      <Controller
        control={control}
        name={SIGNUP_FIELD.SNS_ID}
        render={({ field }) => (
          <Input
            label="인스타그램 아이디 (선택)"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {isGuide ? (
        <Controller
          control={control}
          name={SIGNUP_FIELD.ID_1365}
          render={({ field }) => (
            <Input
              label="1365 (선택)"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      ) : null}
    </StepLayout>
  );
};
