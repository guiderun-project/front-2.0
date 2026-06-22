import type { ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { Input, Textarea, TimeInput } from '@/components';

import { SIGNUP_COPY } from '../../copy';
import type { SignupFormValues } from '../../types';
import { StepLayout } from '../StepLayout';

const HOPE_PREFS_MAX_LENGTH = 100;

export const RecordStep = (): ReactElement => {
  const { control, watch } = useFormContext<SignupFormValues>();
  const isGuide = watch('disabilityType') === 'GUIDE';

  return (
    <StepLayout title={SIGNUP_COPY.record.title}>
      <Controller
        control={control}
        name="record"
        render={({ field }) => (
          // TODO: 입력한 기록에 따른 배정 팀(A~E) 안내는 유효성 검사 단계에서 helperText 로 연결한다.
          <TimeInput label="10KM 러닝기록" value={field.value} onChange={field.onChange} />
        )}
      />

      {isGuide ? (
        <Controller
          control={control}
          name="partneredViName"
          render={({ field }) => (
            <Input
              label="함께한 시각장애러너 이름 (선택)"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      ) : null}

      <Controller
        control={control}
        name="hopePrefs"
        render={({ field }) => (
          <Textarea
            label="희망사항"
            maxLength={HOPE_PREFS_MAX_LENGTH}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </StepLayout>
  );
};
