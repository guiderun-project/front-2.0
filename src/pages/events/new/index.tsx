import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import styled from '@emotion/styled';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import type { EventType } from '@/api/types';
import { BottomSheet, Button, HiddenText, PageLayout } from '@/components';
import { APP_PATH } from '@/router/path';
import { formatDateSrLabel } from '@/utils';

import { EventForm } from '../form/EventForm';
import { EVENT_FORM_MODES } from '../form/constants';
import {
  createEventFormSchema,
  type EventFormValues,
} from '../form/schema';
import { useStatusAnnouncement } from '../form/useStatusAnnouncement';
import {
  addHoursToTime,
  createDefaultEventFormValues,
  formatTimeValueSrLabel,
  getCurrentTimeValue,
  getEventTypeFromQueryValue,
  getQueryValueFromEventType,
  getTodayDateValue,
  isValidDateValue,
  isValidTimeValue,
} from '../form/utils';
import { useEventCreateMutation } from './useEventCreateMutation';

export const EventNewPage = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialEntryRef = useRef(location.key === 'default');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);
  const [createdDate] = useState(() => getTodayDateValue());
  const [createdTime] = useState(() => getCurrentTimeValue());
  const eventType = getEventTypeFromQueryValue(searchParams.get('type'));
  const fallbackEventType: EventType = eventType ?? 'TRAINING';
  const formSchema = useMemo(
    () =>
      createEventFormSchema(fallbackEventType, {
        minimumEventDateTime: {
          date: createdDate,
          time: createdTime,
        },
      }),
    [createdDate, createdTime, fallbackEventType],
  );
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultEventFormValues(fallbackEventType, {
      eventDate: '',
    }),
    mode: 'onChange',
  });
  const date = useWatch({ control: form.control, name: 'date' });
  const startTime = useWatch({ control: form.control, name: 'startTime' });
  const { dirtyFields, isDirty, touchedFields } = useFormState({
    control: form.control,
  });
  const { createEvent, isCreatingEvent } = useEventCreateMutation({ eventType });
  // 시각적으로는 옆 필드 값이 바뀌는 것이 보이지만 스크린리더에는 전달되지
  // 않으므로, 자동 변경 사실을 상시 마운트 status 리전으로 안내한다.
  const { announce, announcedMessage } = useStatusAnnouncement();
  const hasSelectedEventTypeRef = useRef(eventType !== null);

  useEffect(() => {
    form.reset(
      createDefaultEventFormValues(fallbackEventType, {
        eventDate: '',
      }),
    );
  }, [fallbackEventType, form]);

  // 유형 선택 바텀시트가 사라질 때 포커스를 갖던 버튼도 함께 언마운트되어
  // 포커스가 body 로 떨어지므로, 폼 제목(h1)으로 포커스를 옮겨 선택 결과와
  // 현재 위치가 즉시 낭독되게 한다. (쿼리스트링으로 바로 진입한 경우는 최초
  // 로드 낭독 흐름을 방해하지 않도록 건너뛴다)
  useEffect(() => {
    if (!eventType) {
      hasSelectedEventTypeRef.current = false;
      return;
    }

    if (hasSelectedEventTypeRef.current) {
      return;
    }

    hasSelectedEventTypeRef.current = true;

    // 바텀시트 언마운트 시 react-aria 의 포커스 복원이 끝난 뒤에 실행되도록
    // 두 프레임 지연한다.
    let innerFrameId: number | undefined;
    const frameId = window.requestAnimationFrame(() => {
      innerFrameId = window.requestAnimationFrame(() => {
        const heading = document.querySelector<HTMLElement>('main h1');

        if (!heading) {
          return;
        }

        heading.setAttribute('tabindex', '-1');
        heading.focus();
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);

      if (innerFrameId !== undefined) {
        window.cancelAnimationFrame(innerFrameId);
      }
    };
  }, [eventType]);

  useEffect(() => {
    if (
      isValidDateValue(date) &&
      date >= createdDate &&
      !dirtyFields.recruitEndDate &&
      !touchedFields.recruitEndDate
    ) {
      const isChanged = form.getValues('recruitEndDate') !== date;

      form.setValue('recruitEndDate', date, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });

      if (isChanged) {
        announce(
          `모집 마감일이 모임 일시와 같은 ${formatDateSrLabel(date)}로 자동 설정됐어요.`,
        );
      }
    }
  }, [
    announce,
    createdDate,
    date,
    dirtyFields.recruitEndDate,
    form,
    touchedFields.recruitEndDate,
  ]);

  useEffect(() => {
    if (
      isValidTimeValue(startTime) &&
      !dirtyFields.endTime &&
      !touchedFields.endTime
    ) {
      const nextEndTime = addHoursToTime(startTime, 2);
      const isChanged = form.getValues('endTime') !== nextEndTime;

      form.setValue('endTime', nextEndTime, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });

      if (isChanged) {
        announce(
          `종료 시간이 ${formatTimeValueSrLabel(nextEndTime)}으로 자동 설정됐어요.`,
        );
      }
    }
  }, [
    announce,
    dirtyFields.endTime,
    form,
    startTime,
    touchedFields.endTime,
  ]);

  const handleSelectEventType = (nextEventType: EventType) => {
    setSearchParams(
      { type: getQueryValueFromEventType(nextEventType) },
      { replace: true },
    );
  };

  const navigateBackToHome = () => {
    if (!isInitialEntryRef.current) {
      navigate(-1);
      return;
    }

    navigate(APP_PATH.HOME, { replace: true });
  };

  const handleCloseTypeSheet = () => {
    navigateBackToHome();
  };

  const handleBack = () => {
    if (isDirty) {
      setIsBackConfirmOpen(true);
      return;
    }

    navigateBackToHome();
  };

  const handleCancelBack = () => {
    setIsBackConfirmOpen(false);
  };

  const handleConfirmBack = () => {
    navigateBackToHome();
  };

  const handleSubmit = (values: EventFormValues) => {
    createEvent(values);
  };

  if (!eventType) {
    return (
      <PageLayout background="bg.subtle">
        <BottomSheet
          heading={{
            title: '어떤 러닝 모임를 만드시나요?',
            description: '만들려는 모임이 무엇인지 선택해주세요',
          }}
          open
          onClose={handleCloseTypeSheet}
        >
          <TypeActionGroup>
            <Button
              fullWidth
              level="secondary"
              size="l"
              type="button"
              onClick={() => handleSelectEventType('COMPETITION')}
            >
              대회
            </Button>
            <Button
              fullWidth
              size="l"
              type="button"
              onClick={() => handleSelectEventType('TRAINING')}
            >
              훈련
            </Button>
          </TypeActionGroup>
        </BottomSheet>
      </PageLayout>
    );
  }

  return (
    <PageLayout background="bg.subtle">
      <EventForm
        confirmOpen={isBackConfirmOpen}
        eventType={eventType}
        form={form}
        isSubmitting={isCreatingEvent}
        minEventDate={createdDate}
        mode={EVENT_FORM_MODES.CREATE}
        onBack={handleBack}
        onCancelBack={handleCancelBack}
        onConfirmBack={handleConfirmBack}
        onSubmit={handleSubmit}
      />
      {/* 종료 시간·모집 마감일 자동 변경 안내용 상시 마운트 라이브 리전. */}
      <HiddenText role="status">{announcedMessage}</HiddenText>
    </PageLayout>
  );
};

const TypeActionGroup = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.md,
  padding: `${theme.spacing.lg} ${theme.spacing['2xl']} ${theme.spacing['2xl']}`,
}));
