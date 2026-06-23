import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { useFormContext } from 'react-hook-form';

import { CheckBox, Text } from '@/components';

import { SIGNUP_FIELD } from '@/pages/signup/constants';
import { SIGNUP_COPY } from '@/pages/signup/copy';
import type { SignupFormValues } from '@/pages/signup/types';
import { StepLayout } from '@/pages/signup/components/StepLayout';

export const TermsStep = (): ReactElement => {
  const { watch, setValue } = useFormContext<SignupFormValues>();
  const agreements = watch(SIGNUP_FIELD.AGREEMENTS);
  const allChecked = agreements.privacy && agreements.portraitRights;

  const toggleAll = () => {
    const next = !allChecked;
    setValue(SIGNUP_FIELD.AGREEMENTS, { privacy: next, portraitRights: next });
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
              setValue(SIGNUP_FIELD.AGREEMENTS_PRIVACY, event.target.checked)
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
              setValue(SIGNUP_FIELD.AGREEMENTS_PORTRAIT_RIGHTS, event.target.checked)
            }
          />
          <Text color="text.secondary" font="body-s-m">
            초상권 활용 동의 (필수)
          </Text>
        </ItemRow>
      </ItemList>
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
