import type { ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { RUNNER_TYPE } from '@/constants';

import { SIGNUP_FIELD } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { SelectCardGroup } from '@/pages/signup/components/SelectCardGroup';
import { StepLayout } from '@/pages/signup/components/StepLayout';

const EXPERIENCE_OPTIONS: ReadonlyArray<{ value: boolean; label: string }> = [
  { value: true, label: '네, 있어요' },
  { value: false, label: '아니요, 처음이에요' },
];

export const ExperienceStep = (): ReactElement => {
  const { control, watch } = useFormContext<SignupFormValues>();
  const runnerType = watch(SIGNUP_FIELD.DISABILITY_TYPE) ?? RUNNER_TYPE.GUIDE;

  return (
    <StepLayout title={SIGNUP_COPY.experience.title[runnerType]}>
      <Controller
        control={control}
        name={SIGNUP_FIELD.HAS_EXPERIENCE}
        render={({ field, fieldState }) => (
          <SelectCardGroup<boolean>
            ariaLabel="러닝 경험 유무"
            errorText={fieldState.error?.message}
            options={EXPERIENCE_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </StepLayout>
  );
};
