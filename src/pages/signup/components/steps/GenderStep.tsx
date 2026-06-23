import type { ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import type { Gender } from '@/api/types';

import { SIGNUP_FIELD } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { SelectCardGroup } from '@/pages/signup/components/SelectCardGroup';
import { StepLayout } from '@/pages/signup/components/StepLayout';

const GENDER_OPTIONS: ReadonlyArray<{ value: Gender; label: string }> = [
  { value: 'FEMALE', label: '여자' },
  { value: 'MALE', label: '남자' },
];

export const GenderStep = (): ReactElement => {
  const { control } = useFormContext<SignupFormValues>();

  return (
    <StepLayout title={SIGNUP_COPY.gender.title}>
      <Controller
        control={control}
        name={SIGNUP_FIELD.GENDER}
        render={({ field, fieldState }) => (
          <SelectCardGroup<Gender>
            ariaLabel="성별"
            errorText={fieldState.error?.message}
            options={GENDER_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </StepLayout>
  );
};
