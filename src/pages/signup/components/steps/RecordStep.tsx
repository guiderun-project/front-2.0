import type { ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { Input, Textarea, TimeInput } from '@/components';
import { RUNNER_TYPE } from '@/constants';

import { SIGNUP_FIELD } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { StepLayout } from '@/pages/signup/components/StepLayout';
import { deriveRunningGroup, hasRecordInput } from '@/pages/signup/utils';

const HOPE_PREFS_MAX_LENGTH = 100;

export const RecordStep = (): ReactElement => {
  const { control, watch } = useFormContext<SignupFormValues>();
  const runnerType = watch(SIGNUP_FIELD.DISABILITY_TYPE) ?? RUNNER_TYPE.GUIDE;
  const isGuide = runnerType === RUNNER_TYPE.GUIDE;
  const record = watch(SIGNUP_FIELD.RECORD);

  // 입력한 기록이 있을 때만 배정 예정 팀(A~E)을 안내한다.
  const recordHelperText = hasRecordInput(record)
    ? `${deriveRunningGroup(record, runnerType)}팀으로 배정될 예정이에요.`
    : undefined;

  return (
    <StepLayout title={SIGNUP_COPY.record.title}>
      <Controller
        control={control}
        name={SIGNUP_FIELD.RECORD}
        render={({ field }) => (
          <TimeInput
            helperText={recordHelperText}
            label="10KM 러닝기록"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {isGuide ? (
        <Controller
          control={control}
          name={SIGNUP_FIELD.PARTNERED_VI_NAME}
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
        name={SIGNUP_FIELD.HOPE_PREFS}
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
