import { useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';
import { getTodayISODate } from '@/utils';

import { BottomSheet } from '../BottomSheet';
import { Button } from '../Button';
import { Input } from '../Input';

const BIRTH_DATE_MAX_LENGTH = 12;
const BIRTH_DATE_PLACEHOLDER = 'YYYY. MM. DD';

const formatBirthDateInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);

  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)]
    .filter(Boolean)
    .join('. ');
};

const toISODate = (formatted: string): string | null => {
  const match = /^(\d{4})\. (\d{2})\. (\d{2})$/.exec(formatted);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isRealDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);
  const isoDate = `${year}-${month}-${day}`;

  if (!isRealDate || isoDate > getTodayISODate()) {
    return null;
  }

  return isoDate;
};

type BirthDateSheetProps = {
  userName: string;
};

export const BirthDateSheet = ({
  userName,
}: BirthDateSheetProps): ReactElement => {
  const { refreshUser } = useAuth();
  const [birthDate, setBirthDate] = useState('');

  const { isError, isPending, mutate, reset } = useMutation({
    mutationFn: (isoDate: string) =>
      api.user.birthDatePatch({ birthDate: isoDate }),
    onSuccess: async () => {
      await refreshUser();
    },
  });

  const isoDate = toISODate(birthDate);
  const hasFormatError =
    birthDate.length === BIRTH_DATE_MAX_LENGTH && isoDate === null;
  const errorText = isError
    ? '생년월일을 등록하지 못했어요. 다시 시도해주세요.'
    : hasFormatError
      ? '올바른 생년월일을 입력해주세요.'
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
        <Input
          clearLabel="생년월일 지우기"
          clearable
          errorText={errorText}
          inputMode="numeric"
          label="생년월일 8자리"
          maxLength={BIRTH_DATE_MAX_LENGTH}
          placeholder={BIRTH_DATE_PLACEHOLDER}
          value={birthDate}
          onChange={(event) => {
            if (isError) {
              reset();
            }

            setBirthDate(formatBirthDateInput(event.target.value));
          }}
        />
      </Content>
    </BottomSheet>
  );
};

const Content = styled.div(({ theme }) => ({
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['3xl']}`,
}));
