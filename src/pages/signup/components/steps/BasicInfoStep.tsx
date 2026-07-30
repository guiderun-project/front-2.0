import { useId, type ReactElement } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { HiddenText, Input } from '@/components';
import { RUNNER_TYPE } from '@/constants';
import { formatBirthDateInput, PHONE_DIGIT_LENGTH } from '@/utils';

import {
  SIGNUP_FIELD,
  SIGNUP_NAME_MAX_LENGTH,
  SIGNUP_STEP_STAGE,
} from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { StepLayout } from '@/pages/signup/components/StepLayout';

export const BasicInfoStep = (): ReactElement => {
  const { control, watch } = useFormContext<SignupFormValues>();
  const isGuide = watch(SIGNUP_FIELD.DISABILITY_TYPE) === RUNNER_TYPE.GUIDE;
  // 이름 최대 글자수 안내(스크린리더 전용)를 aria-describedby로 연결하기 위한 id
  const nameHintId = useId();

  return (
    <StepLayout stage={SIGNUP_STEP_STAGE.basicInfo} title={SIGNUP_COPY.basicInfo.title}>
      <Controller
        control={control}
        name={SIGNUP_FIELD.NAME}
        render={({ field, fieldState }) => (
          <Input
            aria-required={true}
            autoComplete="name"
            controlRef={field.ref}
            describedById={nameHintId}
            error={Boolean(fieldState.error)}
            errorText={fieldState.error?.message}
            label="이름"
            value={field.value}
            onChange={(event) =>
              field.onChange(
                event.target.value.slice(0, SIGNUP_NAME_MAX_LENGTH),
              )
            }
          />
        )}
      />
      <HiddenText id={nameHintId}>
        {`이름은 최대 ${SIGNUP_NAME_MAX_LENGTH}자까지 입력할 수 있어요`}
      </HiddenText>
      <Controller
        control={control}
        name={SIGNUP_FIELD.BIRTH_DATE}
        render={({ field, fieldState }) => (
          <Input
            aria-required={true}
            controlRef={field.ref}
            error={Boolean(fieldState.error)}
            errorText={fieldState.error?.message}
            inputMode="numeric"
            label="생년월일 8자리"
            placeholder="YYYY.MM.DD"
            value={field.value}
            onChange={(event) =>
              field.onChange(formatBirthDateInput(event.target.value))
            }
          />
        )}
      />
      <Controller
        control={control}
        name={SIGNUP_FIELD.PHONE_NUMBER}
        render={({ field, fieldState }) => (
          <Input
            aria-required={true}
            autoComplete="tel"
            controlRef={field.ref}
            error={Boolean(fieldState.error)}
            errorText={fieldState.error?.message}
            inputMode="numeric"
            label="전화번호"
            name="phone"
            type="tel"
            value={field.value}
            onChange={(event) =>
              field.onChange(
                event.target.value
                  .replace(/\D/g, '')
                  .slice(0, PHONE_DIGIT_LENGTH),
              )
            }
          />
        )}
      />
      <Controller
        control={control}
        name={SIGNUP_FIELD.SNS_ID}
        render={({ field }) => (
          <Input
            label="인스타그램 아이디 (선택)"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {isGuide ? (
        <Controller
          control={control}
          name={SIGNUP_FIELD.ID_1365}
          render={({ field }) => (
            <Input
              label="1365 (선택)"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      ) : null}
    </StepLayout>
  );
};
