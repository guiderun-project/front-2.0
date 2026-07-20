import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import styled from '@emotion/styled';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ConfirmPopup,
  CONFIRM_POPUP_VARIANT,
  HiddenText,
  PageLayout,
} from '@/components';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';
import { formatDateSrLabel } from '@/utils';

import { PageState } from '../components/PanelState';
import { useEventDetailRoute } from '../EventDetailRouteContext';
import { canManageEventPost } from '../utils/eventDetailPermissions';
import { EventForm } from '../../form/EventForm';
import { EVENT_FORM_MODES } from '../../form/constants';
import {
  createEventFormSchema,
  type EventFormValues,
} from '../../form/schema';
import { useStatusAnnouncement } from '../../form/useStatusAnnouncement';
import {
  addHoursToTime,
  createDefaultEventFormValues,
  createEventFormValuesFromDetail,
  formatTimeValueSrLabel,
  isValidDateValue,
  isValidTimeValue,
} from '../../form/utils';
import { useEventEditMutations } from './useEventEditMutations';

export const EventEditPage = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialEntryRef = useRef(location.key === 'default');
  const { user } = useAuth();
  const { event, eventId, isValidEventId } = useEventDetailRoute();
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const initializedEventIdRef = useRef<number | null>(null);
  const previousDateRef = useRef<string | null>(null);
  const previousStartTimeRef = useRef<string | null>(null);
  const canManageEvent = canManageEventPost({ event, user });
  const eventType = event.eventType;
  const formSchema = useMemo(
    () =>
      createEventFormSchema(eventType, {
        validateAdditionalQuestions: false,
      }),
    [eventType],
  );
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultEventFormValues(eventType),
    mode: 'onChange',
  });
  const date = useWatch({ control: form.control, name: 'date' });
  const startTime = useWatch({ control: form.control, name: 'startTime' });
  const { dirtyFields, isDirty, isValid, touchedFields } = useFormState({
    control: form.control,
  });
  const {
    deleteEvent,
    isDeletingEvent,
    isUpdatingEvent,
    updateEvent,
  } = useEventEditMutations({ event, eventId });
  // 시각적으로는 옆 필드 값이 바뀌는 것이 보이지만 스크린리더에는 전달되지
  // 않으므로, 자동 변경 사실을 상시 마운트 status 리전으로 안내한다.
  const { announce, announcedMessage } = useStatusAnnouncement();
  // role="status" 리전이 내용을 가진 채 마운트되면 iOS VoiceOver 가 낭독을
  // 자주 누락하므로, 빈 상태로 마운트한 뒤 다음 프레임에 메시지를 주입한다.
  // (match 페이지 MatchPageMessageContent 와 동일한 패턴)
  const [permissionDeniedMessage, setPermissionDeniedMessage] = useState('');

  useEffect(() => {
    if (canManageEvent) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setPermissionDeniedMessage('모임 수정 권한이 없어요.');
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [canManageEvent]);

  useEffect(() => {
    if (initializedEventIdRef.current === event.eventId) {
      return;
    }

    const nextValues = createEventFormValuesFromDetail(event);

    initializedEventIdRef.current = event.eventId;
    previousDateRef.current = nextValues.date;
    previousStartTimeRef.current = nextValues.startTime;
    form.reset(nextValues);
    void form.trigger();
  }, [event, form]);

  useEffect(() => {
    if (previousDateRef.current === null) {
      previousDateRef.current = date;
      return;
    }

    if (date === previousDateRef.current) {
      return;
    }

    previousDateRef.current = date;

    if (
      isValidDateValue(date) &&
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
    date,
    dirtyFields.recruitEndDate,
    form,
    touchedFields.recruitEndDate,
  ]);

  useEffect(() => {
    if (previousStartTimeRef.current === null) {
      previousStartTimeRef.current = startTime;
      return;
    }

    if (startTime === previousStartTimeRef.current) {
      return;
    }

    previousStartTimeRef.current = startTime;

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

  const navigateBackToDetail = () => {
    if (!isInitialEntryRef.current) {
      navigate(-1);
      return;
    }

    navigate(APP_PATH.EVENT_DETAIL(eventId), { replace: true });
  };

  const handleBack = () => {
    if (isDirty) {
      setIsBackConfirmOpen(true);
      return;
    }

    navigateBackToDetail();
  };

  const handleCancelBack = () => {
    setIsBackConfirmOpen(false);
  };

  const handleConfirmBack = () => {
    navigateBackToDetail();
  };

  const handleSubmit = (values: EventFormValues) => {
    updateEvent(values);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    if (isDeletingEvent) {
      return;
    }

    setIsDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteEvent();
  };

  if (!isValidEventId) {
    return (
      <PageLayout background="bg.subtle">
        <PageState>모임 주소가 올바르지 않아요.</PageState>
      </PageLayout>
    );
  }

  if (!canManageEvent) {
    return (
      <PageLayout background="bg.subtle">
        {/* 상태 화면에도 헤딩 탐색 기준점을 제공한다. (시각 변화 없음) */}
        <VisuallyHiddenHeading>모임 수정</VisuallyHiddenHeading>
        <PageState role="status">{permissionDeniedMessage}</PageState>
      </PageLayout>
    );
  }

  return (
    <PageLayout background="bg.subtle">
      <EventForm
        confirmOpen={isBackConfirmOpen}
        eventType={event.eventType}
        form={form}
        isDeleting={isDeletingEvent}
        isSubmitting={isUpdatingEvent}
        mode={EVENT_FORM_MODES.EDIT}
        submitDisabled={!isValid}
        onBack={handleBack}
        onCancelBack={handleCancelBack}
        onConfirmBack={handleConfirmBack}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
      />
      <ConfirmPopup
        confirmLoading={isDeletingEvent}
        confirmText="삭제하기"
        description="삭제한 게시글은 다시 복구할 수 없어요"
        open={isDeleteConfirmOpen}
        title="모임 게시글을 삭제할까요?"
        variant={CONFIRM_POPUP_VARIANT.DANGER}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      {/* 종료 시간·모집 마감일 자동 변경 안내용 상시 마운트 라이브 리전. */}
      <HiddenText role="status">{announcedMessage}</HiddenText>
    </PageLayout>
  );
};

// HiddenText 는 span 고정이라 헤딩으로 쓸 수 없어, 같은 visually-hidden
// 패턴을 가진 페이지 로컬 h1 을 둔다.
const VisuallyHiddenHeading = styled.h1({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});
