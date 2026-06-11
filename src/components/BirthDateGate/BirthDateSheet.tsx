import { useId, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';

import { BottomSheet } from '../BottomSheet';
import { Button } from '../Button';
import { Text } from '../Text';

const HEADLINE_SUBTITLE = '더 편한 러닝경험을 위해';

const getTodayISODate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

type BirthDateSheetProps = {
  userName: string;
};

export const BirthDateSheet = ({
  userName,
}: BirthDateSheetProps): ReactElement => {
  const { refreshUser } = useAuth();
  const inputId = useId();
  const errorId = useId();
  const today = getTodayISODate();
  const [birthDate, setBirthDate] = useState('');

  const { isError, isPending, mutate, reset } = useMutation({
    mutationFn: (value: string) => api.user.birthDatePatch({ birthDate: value }),
    onSuccess: async () => {
      await refreshUser();
    },
  });

  const isValid = birthDate !== '' && birthDate <= today;

  const handleSubmit = () => {
    if (!isValid || isPending) {
      return;
    }

    mutate(birthDate);
  };

  return (
    <BottomSheet
      isBackdropCloseDisabled
      isCloseButtonHidden
      isEscapeCloseDisabled
      heading={{
        subtitle: HEADLINE_SUBTITLE,
        title: `${userName}님의 생년월일을 알려주세요`,
      }}
      open
      footer={
        <Button
          disabled={!isValid || isPending}
          fullWidth
          size="l"
          type="button"
          onClick={handleSubmit}
        >
          다음
        </Button>
      }
    >
      <Content>
        <BirthDateInput
          aria-describedby={isError ? errorId : undefined}
          aria-invalid={isError}
          aria-label="생년월일"
          id={inputId}
          max={today}
          type="date"
          value={birthDate}
          onChange={(event) => {
            setBirthDate(event.target.value);

            if (isError) {
              reset();
            }
          }}
        />
        {isError ? (
          <Text
            id={errorId}
            as="p"
            color="text.danger"
            font="detail-m-r"
            role="alert"
          >
            생년월일을 등록하지 못했어요. 다시 시도해주세요.
          </Text>
        ) : null}
      </Content>
    </BottomSheet>
  );
};

const Content = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['3xl']}`,
}));

const BirthDateInput = styled.input(({ theme }) => ({
  width: '100%',
  minHeight: theme.pxToRem(74),
  padding: theme.spacing.xl,
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.default,
  color: theme.color.text.primary,
  boxSizing: 'border-box',
  fontFamily: theme.typography['heading-s-m'].fontFamily,
  fontSize: theme.typography['heading-s-m'].fontSize,
  fontWeight: theme.typography['heading-s-m'].fontWeight,
  letterSpacing: theme.typography['heading-s-m'].letterSpacing,
  lineHeight: theme.typography['heading-s-m'].lineHeight,

  '&:focus-visible': {
    outline: 'none',
    borderColor: theme.color.border.focused,
  },
}));
