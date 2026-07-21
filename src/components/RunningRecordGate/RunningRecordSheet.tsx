import { useEffect, useId, useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { getApiErrorMessage } from '@/api/core';
import { useAnnouncedMessage } from '@/hooks/useAnnouncedMessage';

import { BottomSheet } from '../BottomSheet';
import { Button, ButtonGroup } from '../Button';
import { HiddenText } from '../HiddenText';
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
  /** 직전 이벤트 저장 성공 안내. 시트가 열린 채 다음 이벤트로 전환될 때 내부 리전으로 낭독한다. */
  savedAnnouncement: { message: string; revision: number };
  onSaved: () => void;
  onSkipped: () => void;
};

export const RunningRecordSheet = ({
  eventId,
  eventName,
  savedAnnouncement,
  onSaved,
  onSkipped,
}: RunningRecordSheetProps): ReactElement => {
  const unitId = useId();
  const [isInputStep, setIsInputStep] = useState(false);
  const [distance, setDistance] = useState('');
  const distanceInputRef = useRef<HTMLInputElement>(null);

  // 다음 미입력 이벤트로 전환되면 입력 상태를 첫 단계로 초기화한다.
  // key 리마운트 대신 렌더 중 prop 비교로 리셋해(React 'state reset on prop change'
  // 패턴) 시트 등장 애니메이션·딤 페이드가 다시 재생되지 않게 한다.
  const [previousEventId, setPreviousEventId] = useState(eventId);
  if (previousEventId !== eventId) {
    setPreviousEventId(eventId);
    setIsInputStep(false);
    setDistance('');
  }

  const { error, isError, isPending, mutate, reset } =
    useSaveRunningDistance(eventId);
  const {
    error: skipError,
    isError: isSkipError,
    isPending: isSkipping,
    mutate: skip,
    reset: skipReset,
  } = useSkipRunningDistance(eventId, onSkipped);

  // 이벤트 전환 시 직전 이벤트의 save/skip mutation 상태(오류 등)가 남지 않도록
  // 정리한다. key 리마운트를 제거해 mutation 상태가 유지되기 때문이다.
  useEffect(() => {
    reset();
    skipReset();
    // reset 함수들은 mutation 상태 변경마다 참조가 바뀌므로 deps에 넣으면
    // 오류 상태가 즉시 지워진다. 이벤트 전환 시에만 실행한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

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
  // (저장 실패 오류는 onError의 포커스 이동으로 aria-describedby가 낭독하는
  //  단일 채널이다. Input 오류 미러는 포커스가 막 도착한 오류의 주입을 생략한다.)
  const announcedPendingMessage = useAnnouncedMessage(
    isPending ? '저장 중이에요' : isSkipping ? '건너뛰는 중이에요' : '',
  );
  const announcedSkipErrorMessage = useAnnouncedMessage(skipErrorText ?? '');
  // 다중 미입력 이벤트에서 저장 성공으로 다음 이벤트로 전환되면 시트가 계속 열려 있어
  // 게이트 바깥 리전이 모달의 aria-hidden에 가려지므로, 시트 내부 리전으로 안내한다.
  const announcedSavedMessage = useAnnouncedMessage(
    savedAnnouncement.message,
    savedAnnouncement.revision,
  );

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
        // (검증-포커스 흐름에서는 Input 오류 미러가 주입을 생략해 중복 낭독이 없다.)
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
      <HiddenText role="status">{announcedSavedMessage}</HiddenText>
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
