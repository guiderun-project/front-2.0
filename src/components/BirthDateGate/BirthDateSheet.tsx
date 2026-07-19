import { useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';

import { getApiErrorMessage } from '@/api/core';
import { api } from '@/api/services';
import { useAuth } from '@/contexts';
import { getTodayISODate, isValidBirthDateISO } from '@/utils';

import { BottomSheet } from '../BottomSheet';
import { Button } from '../Button';
import { DateInput } from '../Input';

const BIRTH_DATE_ERROR_MESSAGE = '올바른 생년월일을 입력해주세요';

type BirthDateSheetProps = {
  userName: string;
};

export const BirthDateSheet = ({
  userName,
}: BirthDateSheetProps): ReactElement => {
  const { refreshUser } = useAuth();
  const [birthDate, setBirthDate] = useState('');

  const { error, isError, isPending, mutate, reset } = useMutation({
    mutationFn: (isoDate: string) =>
      api.user.birthDatePatch({ birthDate: isoDate }),
    onSuccess: async () => {
      await refreshUser();
    },
  });

  const isoDate = isValidBirthDateISO(birthDate) ? birthDate : null;
  const hasFormatError = birthDate.length > 0 && isoDate === null;
  const errorText = isError
    ? getApiErrorMessage(
        error,
        '생년월일을 등록하지 못했어요. 다시 시도해주세요.',
      )
    : hasFormatError
      ? BIRTH_DATE_ERROR_MESSAGE
      : undefined;

  const handleSubmit = () => {
    if (isoDate === null || isPending) {
      return;
    }

    mutate(isoDate);
  };

  return (
    <BottomSheet
      isBackdropCloseDisabled
      isCloseButtonHidden
      isEscapeCloseDisabled
      heading={{
        subtitle: '더 편한 러닝경험을 위해',
        title: `${userName}님의 생년월일을 알려주세요`,
      }}
      open
      footer={
        <Button
          disabled={isoDate === null || isPending}
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
        <DateInput
          errorText={errorText}
          label="생년월일"
          max={getTodayISODate()}
          value={birthDate}
          onChange={(value) => {
            if (isError) {
              reset();
            }

            setBirthDate(value);
          }}
        />
      </Content>
    </BottomSheet>
  );
};

const Content = styled.div(({ theme }) => ({
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['3xl']}`,
}));
