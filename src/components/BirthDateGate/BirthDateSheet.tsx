import { useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';

import { getApiErrorMessage } from '@/api/core';
import { api } from '@/api/services';
import { useAuth } from '@/contexts';
import { getTodayISODate, isValidBirthDateISO } from '@/utils';

import { BottomSheet } from '../BottomSheet';
import { Button } from '../Button';
import { HiddenText } from '../HiddenText';
import { DateInput } from '../Input';
import { useAnnouncedMessage } from './useAnnouncedMessage';

const BIRTH_DATE_ERROR_MESSAGE = '올바른 생년월일을 입력해주세요';

type BirthDateSheetProps = {
  userName: string;
  onRegistered: () => void;
};

export const BirthDateSheet = ({
  onRegistered,
  userName,
}: BirthDateSheetProps): ReactElement => {
  const { refreshUser } = useAuth();
  const [birthDate, setBirthDate] = useState('');
  const birthDateInputRef = useRef<HTMLInputElement>(null);

  const { error, isError, isPending, mutate, reset } = useMutation({
    mutationFn: (isoDate: string) =>
      api.user.birthDatePatch({ birthDate: isoDate }),
    onSuccess: async () => {
      onRegistered();
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

  // 제출 중에는 버튼이 disabled 되며 포커스가 사라지므로, 진행 상태를
  // 다이얼로그 내부의 상시 마운트 라이브 리전으로 안내한다.
  // (등록 실패 오류는 Input 내부의 오류 미러링 리전이 낭독한다.)
  const announcedPendingMessage = useAnnouncedMessage(
    isPending ? '등록 중이에요' : '',
  );

  const handleSubmit = () => {
    if (isoDate === null || isPending) {
      return;
    }

    mutate(isoDate, {
      onError: () => {
        // 오류 텍스트가 렌더된 다음 프레임에 입력으로 포커스를 옮겨
        // 라벨과 aria-describedby 오류가 함께 낭독되게 한다.
        window.requestAnimationFrame(() => {
          birthDateInputRef.current?.focus();
        });
      },
    });
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
      <HiddenText role="status">{announcedPendingMessage}</HiddenText>
      <Content>
        <DateInput
          controlRef={birthDateInputRef}
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
