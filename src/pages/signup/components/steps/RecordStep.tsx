import { useEffect, useRef, type ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { Input, Select, Textarea, TimeInput, type SelectOptions } from '@/components';
import {
  RUNNER_TYPE,
  TRAINING_RECORD_LABELS,
  deriveRunningGroup,
  type RunnerRecordGroup,
} from '@/constants';

import { SIGNUP_FIELD } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { StepLayout } from '@/pages/signup/components/StepLayout';

const HOPE_PREFS_MAX_LENGTH = 100;

const RECORD_GROUPS: readonly RunnerRecordGroup[] = ['A', 'B', 'C', 'D', 'E'];

export const RecordStep = (): ReactElement => {
  const { control, watch, setValue } = useFormContext<SignupFormValues>();
  const runnerType = watch(SIGNUP_FIELD.DISABILITY_TYPE) ?? RUNNER_TYPE.GUIDE;
  const isGuide = runnerType === RUNNER_TYPE.GUIDE;
  const hasExperience = watch(SIGNUP_FIELD.HAS_EXPERIENCE);
  const record = watch(SIGNUP_FIELD.RECORD);

  // 러닝 그룹은 10KM 기록으로 자동 채우되, 사용자가 직접 바꾸면 그 값을 유지한다.
  const isGroupEditedRef = useRef(false);

  useEffect(() => {
    if (isGroupEditedRef.current) {
      return;
    }

    setValue(SIGNUP_FIELD.RECORD_DEGREE, deriveRunningGroup(record, runnerType), {
      shouldDirty: false,
    });
  }, [record, runnerType, setValue]);

  const recordGroupOptions: SelectOptions<RunnerRecordGroup> = RECORD_GROUPS.map(
    (group) => ({
      value: group,
      label: `${group} ${TRAINING_RECORD_LABELS[runnerType][group]}`,
    }),
  );

  return (
    <StepLayout title={SIGNUP_COPY.record.title}>
      <Controller
        control={control}
        name={SIGNUP_FIELD.RECORD}
        render={({ field, fieldState }) => (
          <TimeInput
            errorText={fieldState.error?.message}
            label="10KM 러닝기록"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name={SIGNUP_FIELD.RECORD_DEGREE}
        render={({ field }) => (
          <Select
            label="러닝 그룹"
            options={recordGroupOptions}
            sheetTitle="러닝 그룹"
            value={field.value}
            onChange={(value) => {
              isGroupEditedRef.current = true;
              field.onChange(value);
            }}
          />
        )}
      />

      {isGuide && hasExperience ? (
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
