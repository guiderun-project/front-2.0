import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { useFormContext } from 'react-hook-form';

import { CheckBox, Text } from '@/components';

import { SIGNUP_FIELD } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { StepLayout } from '@/pages/signup/components/StepLayout';

export const TermsStep = (): ReactElement => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  const agreements = watch(SIGNUP_FIELD.AGREEMENTS);
  const allChecked = agreements.privacy && agreements.portraitRights;

  // 체크 시 검증 에러를 즉시 해제하기 위해 shouldValidate 로 재검증한다.
  const setAgreement = (
    name: typeof SIGNUP_FIELD.AGREEMENTS_PRIVACY | typeof SIGNUP_FIELD.AGREEMENTS_PORTRAIT_RIGHTS,
    checked: boolean,
  ) => setValue(name, checked, { shouldValidate: true });

  const toggleAll = () => {
    const next = !allChecked;
    setValue(
      SIGNUP_FIELD.AGREEMENTS,
      { privacy: next, portraitRights: next },
      { shouldValidate: true },
    );
  };

  return (
    <StepLayout title={SIGNUP_COPY.terms.title}>
      <AllRow>
        <CheckBox checked={allChecked} onChange={toggleAll} />
        <Text color="text.primary" font="body-m-sb">
          전체 동의하기
        </Text>
      </AllRow>

      <ItemList>
        <ItemRow>
          <CheckBox
            checked={agreements.privacy}
            onChange={(event) =>
              setAgreement(SIGNUP_FIELD.AGREEMENTS_PRIVACY, event.target.checked)
            }
          />
          <Text color="text.secondary" font="body-s-m">
            개인정보 제공 및 활용 동의 (필수)
          </Text>
        </ItemRow>
        <ItemRow>
          <CheckBox
            checked={agreements.portraitRights}
            onChange={(event) =>
              setAgreement(
                SIGNUP_FIELD.AGREEMENTS_PORTRAIT_RIGHTS,
                event.target.checked,
              )
            }
          />
          <Text color="text.secondary" font="body-s-m">
            초상권 활용 동의 (필수)
          </Text>
        </ItemRow>
      </ItemList>

      {errors.agreements?.privacy?.message || errors.agreements?.portraitRights?.message ? (
        <Text color="text.danger" font="detail-m-r" role="alert">
          {errors.agreements?.privacy?.message ??
            errors.agreements?.portraitRights?.message}
        </Text>
      ) : null}
    </StepLayout>
  );
};

const AllRow = styled.label(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.subtle,
  cursor: 'pointer',
}));

const ItemList = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: `${theme.spacing.none} ${theme.spacing.xl}`,
}));

const ItemRow = styled.label(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.lg,
  cursor: 'pointer',
}));
