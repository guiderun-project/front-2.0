import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { useFormContext } from 'react-hook-form';

import { CheckBox, Text } from '@/components';

import { TERMS_SECTIONS } from '@/pages/terms/constants';

import { SIGNUP_FIELD } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { StepLayout } from '@/pages/signup/components/StepLayout';

const SECTION_CONFIG: Record<
  string,
  {
    field:
      | typeof SIGNUP_FIELD.AGREEMENTS_PRIVACY
      | typeof SIGNUP_FIELD.AGREEMENTS_PORTRAIT_RIGHTS
      | typeof SIGNUP_FIELD.AGREEMENTS_SAFETY;
    agreementKey: keyof SignupFormValues['agreements'];
  }
> = {
  privacy: { field: SIGNUP_FIELD.AGREEMENTS_PRIVACY, agreementKey: 'privacy' },
  portrait: {
    field: SIGNUP_FIELD.AGREEMENTS_PORTRAIT_RIGHTS,
    agreementKey: 'portraitRights',
  },
  safety: { field: SIGNUP_FIELD.AGREEMENTS_SAFETY, agreementKey: 'safety' },
};

export const TermsStep = (): ReactElement => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  const agreements = watch(SIGNUP_FIELD.AGREEMENTS);
  const allChecked =
    agreements.privacy && agreements.portraitRights && agreements.safety;

  // 체크 시 검증 에러를 즉시 해제하기 위해 shouldValidate 로 재검증한다.
  const setAgreement = (
    name:
      | typeof SIGNUP_FIELD.AGREEMENTS_PRIVACY
      | typeof SIGNUP_FIELD.AGREEMENTS_PORTRAIT_RIGHTS
      | typeof SIGNUP_FIELD.AGREEMENTS_SAFETY,
    checked: boolean,
  ) => setValue(name, checked, { shouldValidate: true });

  const toggleAll = () => {
    const next = !allChecked;
    setValue(
      SIGNUP_FIELD.AGREEMENTS,
      { privacy: next, portraitRights: next, safety: next },
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
        {TERMS_SECTIONS.map((section) => {
          const config = SECTION_CONFIG[section.key];
          if (!config) return null;
          return (
            <ItemRow key={section.key}>
              <CheckBox
                checked={agreements[config.agreementKey]}
                onChange={(event) =>
                  setAgreement(config.field, event.target.checked)
                }
              />
              <Text color="text.secondary" font="body-s-m">
                {section.title}{section.required && ' (필수)'}
              </Text>
            </ItemRow>
          );
        })}
      </ItemList>

      {errors.agreements?.privacy?.message ||
      errors.agreements?.portraitRights?.message ? (
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
