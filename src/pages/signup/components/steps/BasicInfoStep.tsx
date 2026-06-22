import type { ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '@/components';
import { BIRTH_DATE_MAX_LENGTH, formatBirthDateInput } from '@/utils';

import { SIGNUP_COPY } from '../../copy';
import type { SignupFormValues } from '../../types';
import { StepLayout } from '../StepLayout';

export const BasicInfoStep = (): ReactElement => {
  const { control, watch } = useFormContext<SignupFormValues>();
  const isGuide = watch('disabilityType') === 'GUIDE';

  return (
    <StepLayout title={SIGNUP_COPY.basicInfo.title}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input label="이름" value={field.value} onChange={field.onChange} />
        )}
      />
      <Controller
        control={control}
        name="birthDate"
        render={({ field }) => (
          <Input
            inputMode="numeric"
            label="생년월일"
            maxLength={BIRTH_DATE_MAX_LENGTH}
            value={field.value}
            onChange={(event) => field.onChange(formatBirthDateInput(event.target.value))}
          />
        )}
      />
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <Input
            inputMode="numeric"
            label="전화번호"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="snsId"
        render={({ field }) => (
          <Input label="인스타그램 아이디 (선택)" value={field.value} onChange={field.onChange} />
        )}
      />
      {isGuide ? (
        <Controller
          control={control}
          name="id1365"
          render={({ field }) => (
            <Input label="1365 (선택)" value={field.value} onChange={field.onChange} />
          )}
        />
      ) : null}
    </StepLayout>
  );
};
