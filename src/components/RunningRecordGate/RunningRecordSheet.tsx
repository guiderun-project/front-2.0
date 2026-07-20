import { useId, useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { getApiErrorMessage } from '@/api/core';
import { BottomSheet } from '../BottomSheet';
import { Button, ButtonGroup } from '../Button';
import { HiddenText } from '../HiddenText';
import { Input } from '../Input';
import { Text } from '../Text';
import { useAnnouncedMessage } from './hooks/useAnnouncedMessage';
import { useSaveRunningDistance } from './hooks/useSaveRunningDistance';
import { useSkipRunningDistance } from './hooks/useSkipRunningDistance';

const formatDistanceInput = (raw: string): string => {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const [whole = '', ...rest] = cleaned.split('.');

  if (rest.length === 0) {
    return whole;
  }

  return `${whole}.${rest.join('').slice(0, 3)}`;
};

const parseDistance = (value: string): number | null => {
  const distance = Number(value);

  return value !== '' && Number.isFinite(distance) && distance > 0
    ? distance
    : null;
};

type RunningRecordSheetProps = {
  eventId: number;
  eventName: string;
  onSaved: () => void;
};

export const RunningRecordSheet = ({
  eventId,
  eventName,
  onSaved,
}: RunningRecordSheetProps): ReactElement => {
  const unitId = useId();
  const [isInputStep, setIsInputStep] = useState(false);
  const [distance, setDistance] = useState('');
  const distanceInputRef = useRef<HTMLInputElement>(null);

  const { error, isError, isPending, mutate, reset } =
    useSaveRunningDistance(eventId);
  const {
    error: skipError,
    isError: isSkipError,
    isPending: isSkipping,
    mutate: skip,
  } = useSkipRunningDistance(eventId);

  const handleSkip = () => {
    if (isSkipping) {
      return;
    }

    skip();
  };

  const parsedDistance = parseDistance(distance);
  const errorText = isError
    ? getApiErrorMessage(
        error,
        '러닝 거리를 저장하지 못했어요. 다시 시도해주세요.',
      )
    : undefined;
  // '괜찮아요'(건너뛰기) 실패는 화면에 별도 표시가 없어 라이브 리전으로만 안내한다.
  const skipErrorText = isSkipError
    ? getApiErrorMessage(skipError, '요청에 실패했어요. 다시 시도해주세요.')
    : undefined;

  // 제출 중에는 버튼이 disabled 되며 포커스가 사라지므로, 진행/실패 상태를
  // 다이얼로그 내부의 상시 마운트 라이브 리전으로 안내한다.
  // (저장 실패 오류는 Input 내부의 오류 미러링 리전이 낭독한다.)
  const announcedPendingMessage = useAnnouncedMessage(
    isPending ? '저장 중이에요' : isSkipping ? '건너뛰는 중이에요' : '',
  );
  const announcedSkipErrorMessage = useAnnouncedMessage(skipErrorText ?? '');

  const title = (
    <>
      지난번에 주최한{' '}
      <Text as="span" color="text.brand" font="heading-s-sb">
        {eventName}
      </Text>
      에서
      <br />
      {isInputStep ? '몇 KM 달렸는지 알려주세요' : '달린 기록을 입력해볼까요?'}
    </>
  );

  const description = isInputStep ? (
    <>
      정확하지 않아도 괜찮아요.
      <br />
      입력한 정보는 참여자 기록에 반영될 예정이에요
    </>
  ) : (
    '작성한 내용은 가이드런 연말 기록에 쓰여요'
  );

  const handleSubmit = () => {
    if (parsedDistance === null || isPending) {
      return;
    }

    mutate(parsedDistance, {
      onSuccess: () => {
        onSaved();
      },
      onError: () => {
        // 오류 텍스트가 렌더된 다음 프레임에 입력으로 포커스를 옮겨
        // 라벨과 aria-describedby 오류가 함께 낭독되게 한다.
        window.requestAnimationFrame(() => {
          distanceInputRef.current?.focus();
        });
      },
    });
  };

  const footer = isInputStep ? (
    <Button
      disabled={parsedDistance === null || isPending}
      fullWidth
      size="l"
      type="button"
      onClick={handleSubmit}
    >
      확인
    </Button>
  ) : (
    <SheetButtonGroup ratio="35:65">
      <Button
        disabled={isSkipping}
        level="secondary"
        size="l"
        type="button"
        onClick={handleSkip}
      >
        괜찮아요
      </Button>
      <Button size="l" type="button" onClick={() => setIsInputStep(true)}>
        기록 입력할게요
      </Button>
    </SheetButtonGroup>
  );

  return (
    <BottomSheet
      heading={{ title, description }}
      isBackdropCloseDisabled
      isEscapeCloseDisabled
      open
      footer={footer}
      onClose={handleSkip}
    >
      <HiddenText role="status">{announcedPendingMessage}</HiddenText>
      <HiddenText role="alert">{announcedSkipErrorMessage}</HiddenText>
      {isInputStep ? (
        <Content>
          <Input
            autoFocus
            clearLabel="러닝 거리 지우기"
            clearable
            controlRef={distanceInputRef}
            describedById={unitId}
            errorText={errorText}
            inputMode="decimal"
            label="러닝 거리"
            trailing={
              <Text as="span" color="text.primary" font="body-l-m" id={unitId}>
                KM
              </Text>
            }
            value={distance}
            onChange={(event) => {
              if (isError) {
                reset();
              }

              setDistance(formatDistanceInput(event.target.value));
            }}
          />
        </Content>
      ) : null}
    </BottomSheet>
  );
};

const Content = styled.div(({ theme }) => ({
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['3xl']}`,
}));

const SheetButtonGroup = styled(ButtonGroup)({
  paddingInline: 0,
});
