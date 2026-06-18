import { useId, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { BottomSheet } from '../BottomSheet';
import { Button, ButtonGroup } from '../Button';
import { Input } from '../Input';
import { Text } from '../Text';
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
};

export const RunningRecordSheet = ({
  eventId,
  eventName,
}: RunningRecordSheetProps): ReactElement => {
  const unitId = useId();
  const [isInputStep, setIsInputStep] = useState(false);
  const [distance, setDistance] = useState('');

  const { isError, isPending, mutate, reset } = useSaveRunningDistance(eventId);
  const { isPending: isSkipping, mutate: skip } = useSkipRunningDistance(eventId);

  const handleSkip = () => {
    if (isSkipping) {
      return;
    }

    skip();
  };

  const parsedDistance = parseDistance(distance);
  const errorText = isError
    ? '러닝 거리를 저장하지 못했어요. 다시 시도해주세요.'
    : undefined;

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

    mutate(parsedDistance);
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
    <ButtonGroup ratio="35:65">
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
    </ButtonGroup>
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
      {isInputStep ? (
        <Content>
          <Input
            autoFocus
            clearLabel="러닝 거리 지우기"
            clearable
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
