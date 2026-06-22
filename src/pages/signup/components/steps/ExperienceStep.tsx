import type { ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { SIGNUP_COPY } from '../../copy';
import type { SignupFormValues } from '../../types';
import { SelectCardGroup } from '../SelectCardGroup';
import { StepLayout } from '../StepLayout';

const EXPERIENCE_OPTIONS: ReadonlyArray<{ value: boolean; label: string }> = [
  { value: true, label: '네, 있어요' },
  { value: false, label: '아니요, 처음이에요' },
];

export const ExperienceStep = (): ReactElement => {
  const { control } = useFormContext<SignupFormValues>();

  return (
    <StepLayout title={SIGNUP_COPY.experience.title}>
      <Controller
        control={control}
        name="hasExperience"
        render={({ field }) => (
          <SelectCardGroup<boolean>
            ariaLabel="러닝 경험 유무"
            options={EXPERIENCE_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </StepLayout>
  );
};
