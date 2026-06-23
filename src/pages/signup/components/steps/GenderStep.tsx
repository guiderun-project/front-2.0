import type { ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { Gender, SignupFormValues } from '@/pages/signup/types';
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
        name="gender"
        render={({ field }) => (
          <SelectCardGroup<Gender>
            ariaLabel="성별"
            options={GENDER_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </StepLayout>
  );
};
