import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Controller, useFormContext } from 'react-hook-form';

import { Input, Text, Textarea, TimeInput } from '@/components';
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
  const hasExperience = watch(SIGNUP_FIELD.HAS_EXPERIENCE);
  const record = watch(SIGNUP_FIELD.RECORD);

  // 입력한 기록이 있을 때만 배정 예정 팀(A~E)을 안내한다.
  const recordHelperText = hasRecordInput(record)
    ? `${deriveRunningGroup(record, runnerType)}팀으로 배정될 예정이에요.`
    : undefined;

  return (
    <StepLayout title={SIGNUP_COPY.record.title}>
      {hasExperience === false ? (
        // 러닝 경험이 없으면 기록을 받지 않고 E팀 배정을 안내한다.
        <TeamStatusField aria-disabled="true">
          <Text color="text.secondary" font="heading-s-m">
            E팀으로 배정될 예정이에요
          </Text>
        </TeamStatusField>
      ) : (
        <Controller
          control={control}
          name={SIGNUP_FIELD.RECORD}
          render={({ field, fieldState }) => (
            <TimeInput
              errorText={fieldState.error?.message}
              helperText={recordHelperText}
              label="10KM 러닝기록"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      )}

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

// 경험 없음일 때 10KM 기록 입력 대신 노출하는 읽기 전용 배정 안내 필드. (Figma node 2171-3615)
const TeamStatusField = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing.xl,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.color.border.default}`,
  backgroundColor: theme.color.bg.subtle,
}));
