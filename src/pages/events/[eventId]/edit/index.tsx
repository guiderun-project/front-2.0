import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ConfirmPopup, CONFIRM_POPUP_VARIANT, PageLayout } from '@/components';
import { USER_ROLES } from '@/constants/roles';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import { PageState } from '../components/PanelState';
import { useEventDetailRoute } from '../EventDetailRouteContext';
import { EventForm } from '../../form/EventForm';
import { EVENT_FORM_MODES } from '../../form/constants';
import {
  createEventFormSchema,
  type EventFormValues,
} from '../../form/schema';
import {
  addHoursToTime,
  createDefaultEventFormValues,
  createEventFormValuesFromDetail,
  isValidDateValue,
  isValidTimeValue,
} from '../../form/utils';
import { useEventEditMutations } from './useEventEditMutations';

export const EventEditPage = (): ReactElement => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { event, eventId, isValidEventId } = useEventDetailRoute();
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const initializedEventIdRef = useRef<number | null>(null);
  const previousDateRef = useRef<string | null>(null);
  const previousStartTimeRef = useRef<string | null>(null);
  const canManageEvent =
    user !== null &&
    (event.viewer?.isOrganizer === true || user.role === USER_ROLES.ADMIN);
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
      form.setValue('recruitEndDate', date, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [
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
      form.setValue('endTime', addHoursToTime(startTime, 2), {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [
    dirtyFields.endTime,
    form,
    startTime,
    touchedFields.endTime,
  ]);

  const handleBack = () => {
    if (isDirty) {
      setIsBackConfirmOpen(true);
      return;
    }

    navigate(APP_PATH.EVENT_DETAIL(eventId));
  };

  const handleCancelBack = () => {
    setIsBackConfirmOpen(false);
  };

  const handleConfirmBack = () => {
    navigate(APP_PATH.EVENT_DETAIL(eventId));
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
        <PageState>모임 수정 권한이 없어요.</PageState>
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
    </PageLayout>
  );
};
