import { useEffect, useState, type ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { HiddenText, Input, Select, Textarea, TimeInput, type SelectOptions } from '@/components';
import {
  RUNNER_TYPE,
  TRAINING_RECORD_LABELS,
  TRAINING_RECORD_SR_LABELS,
  deriveRunningGroupIfComplete,
  type RunnerRecordGroup,
} from '@/constants';

import { SIGNUP_FIELD, SIGNUP_STEP_STAGE } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { StepLayout } from '@/pages/signup/components/StepLayout';

const HOPE_PREFS_MAX_LENGTH = 100;

const RECORD_GROUPS: readonly RunnerRecordGroup[] = ['A', 'B', 'C', 'D', 'E'];

export const RecordStep = (): ReactElement => {
  const { control, watch, setValue, getValues } =
    useFormContext<SignupFormValues>();
  const runnerType = watch(SIGNUP_FIELD.DISABILITY_TYPE) ?? RUNNER_TYPE.GUIDE;
  const isGuide = runnerType === RUNNER_TYPE.GUIDE;
  const hasExperience = watch(SIGNUP_FIELD.HAS_EXPERIENCE);
  const record = watch(SIGNUP_FIELD.RECORD);

  // 러닝 그룹 자동 변경을 스크린리더에 알리는 안내(상시 마운트 status 리전에 주입)
  const [groupSyncNotice, setGroupSyncNotice] = useState('');

  // 6글자가 다 채워지면 러닝 그룹을 기록에 맞춰 동기화한다. (이후 수동 수정도 다음 기록 입력에 덮인다)
  useEffect(() => {
    const syncedGroup = deriveRunningGroupIfComplete(record, runnerType);

    if (syncedGroup === null) {
      return;
    }

    const previousGroup = getValues(SIGNUP_FIELD.RECORD_DEGREE);

    setValue(SIGNUP_FIELD.RECORD_DEGREE, syncedGroup, {
      shouldDirty: false,
    });

    if (previousGroup === syncedGroup) {
      return;
    }

    // 그룹이 실제로 바뀔 때만 안내해 무의미한 반복 낭독을 피한다.
    // (렌더 커밋 후 다음 프레임에 주입해 상시 마운트 리전의 변경 낭독을 보장한다)
    const frameId = window.requestAnimationFrame(() => {
      setGroupSyncNotice(
        `입력한 기록에 따라 러닝 그룹이 ${syncedGroup}, ${TRAINING_RECORD_SR_LABELS[runnerType][syncedGroup]} 그룹으로 설정되었어요`,
      );
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [record, runnerType, setValue, getValues]);

  const recordGroupOptions: SelectOptions<RunnerRecordGroup> = RECORD_GROUPS.map(
    (group) => ({
      value: group,
      label: `${group} ${TRAINING_RECORD_LABELS[runnerType][group]}`,
      // 시각 라벨의 물결표(~)는 스크린리더가 생략해 이하/이상 의미가 사라지므로
      // 범위를 풀어 쓴 SR 전용 라벨을 병행한다. 화면 표시는 label 그대로다.
      srLabel: `${group} ${TRAINING_RECORD_SR_LABELS[runnerType][group]}`,
    }),
  );

  return (
    <StepLayout stage={SIGNUP_STEP_STAGE.record} title={SIGNUP_COPY.record.title}>
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
            onChange={field.onChange}
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

      <HiddenText role="status">{groupSyncNotice}</HiddenText>
    </StepLayout>
  );
};
