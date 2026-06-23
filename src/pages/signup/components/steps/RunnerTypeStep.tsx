import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Controller, useFormContext } from 'react-hook-form';

import { Icon, Text } from '@/components';
import { RUNNER_TYPE, RUNNER_TYPE_LABELS } from '@/constants';

import { SIGNUP_FIELD } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { RunnerType, SignupFormValues } from '@/pages/signup/types';
import { SelectCardGroup } from '@/pages/signup/components/SelectCardGroup';
import { StepLayout } from '@/pages/signup/components/StepLayout';

const RUNNER_TYPE_OPTIONS: ReadonlyArray<{ value: RunnerType; label: string }> = [
  { value: RUNNER_TYPE.GUIDE, label: RUNNER_TYPE_LABELS.GUIDE },
  { value: RUNNER_TYPE.VI, label: RUNNER_TYPE_LABELS.VI },
];

export const RunnerTypeStep = (): ReactElement => {
  const { control } = useFormContext<SignupFormValues>();
  const info = SIGNUP_COPY.runnerType.info;

  return (
    <StepLayout title={SIGNUP_COPY.runnerType.title}>
      <Controller
        control={control}
        name={SIGNUP_FIELD.DISABILITY_TYPE}
        render={({ field, fieldState }) => (
          <SelectCardGroup<RunnerType>
            ariaLabel="참여 유형"
            errorText={fieldState.error?.message}
            options={RUNNER_TYPE_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <InfoBox>
        <InfoHeader>
          <Icon aria-hidden={true} color="icon.secondary" icon="help-circle-filled" size={20} />
          <Text color="text.secondary" font="detail-m-sb">
            {info.title}
          </Text>
        </InfoHeader>
        <InfoBody color="text.tertiary" font="detail-m-r">
          {info.body}
        </InfoBody>
      </InfoBox>
    </StepLayout>
  );
};

const InfoBox = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.subtle,
}));

const InfoHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.s,
}));

const InfoBody = styled(Text)({
  whiteSpace: 'pre-line',
});
