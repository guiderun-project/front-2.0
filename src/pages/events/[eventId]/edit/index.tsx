import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { api } from '@/api/services';
import { ConfirmPopup, CONFIRM_POPUP_VARIANT, PageLayout } from '@/components';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import { PageState } from '../components/PanelState';
import { eventDetailQueryKeys, getEventDetailViewerKey } from '../queryKeys';
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
  createEventUpdateRequest,
  isValidDateValue,
  isValidTimeValue,
} from '../../form/utils';

export const EventEditPage = (): ReactElement => {
  const { eventId: eventIdParam } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthReady, user } = useAuth();
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const initializedEventIdRef = useRef<number | null>(null);
  const previousDateRef = useRef<string | null>(null);
  const previousStartTimeRef = useRef<string | null>(null);
  const eventId = Number(eventIdParam);
  const isValidEventId = Number.isInteger(eventId) && eventId > 0;
  const viewerKey = getEventDetailViewerKey(user?.userId);
  const eventDetailQuery = useQuery({
    queryKey: eventDetailQueryKeys.detail(eventId, viewerKey),
    queryFn: () => api.event.detailGet({ eventId }),
    enabled: isValidEventId && isAuthReady,
  });
  const event = eventDetailQuery.data ?? null;
  const canManageEvent =
    event !== null &&
    user !== null &&
    (event.viewer?.isOrganizer === true || user.role === 'ROLE_ADMIN');
  const eventType = event?.eventType ?? 'TRAINING';
  const formSchema = useMemo(
    () => createEventFormSchema(eventType),
    [eventType],
  );
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultEventFormValues(eventType),
  });
  const formValues = useWatch({ control: form.control });
  const date = useWatch({ control: form.control, name: 'date' });
  const startTime = useWatch({ control: form.control, name: 'startTime' });
  const isFormSubmittable = useMemo(
    () => formSchema.safeParse(formValues).success,
    [formSchema, formValues],
  );
  const { dirtyFields, isDirty, touchedFields } = useFormState({
    control: form.control,
  });
  const updateMutation = useMutation({
    mutationFn: (values: EventFormValues) => {
      if (!event) {
        throw new Error('Event detail is required.');
      }

      return api.event.updatePatch({
        eventId,
        body: createEventUpdateRequest({
          eventType: event.eventType,
          values,
        }),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.detailRoot(eventId),
      });
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.root,
      });
      navigate(APP_PATH.EVENT_DETAIL(eventId));
    },
    onError: () => {
      window.alert('모임 수정에 실패했어요.');
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => api.event.delete({ eventId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.root,
      });
      navigate(APP_PATH.EVENTS);
    },
    onError: () => {
      window.alert('모집 게시글 삭제에 실패했어요.');
    },
  });

  useEffect(() => {
    if (!event || initializedEventIdRef.current === event.eventId) {
      return;
    }

    const nextValues = createEventFormValuesFromDetail(event);

    initializedEventIdRef.current = event.eventId;
    previousDateRef.current = nextValues.date;
    previousStartTimeRef.current = nextValues.startTime;
    form.reset(nextValues);
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
    updateMutation.mutate(values);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    if (deleteMutation.isPending) {
      return;
    }

    setIsDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  if (!isValidEventId) {
    return (
      <PageLayout background="bg.subtle">
        <PageState>모임 주소가 올바르지 않아요.</PageState>
      </PageLayout>
    );
  }

  if (!isAuthReady || eventDetailQuery.isPending) {
    return (
      <PageLayout background="bg.subtle">
        <PageState>모임 정보를 불러오는 중이에요.</PageState>
      </PageLayout>
    );
  }

  if (eventDetailQuery.isError || !event) {
    return (
      <PageLayout background="bg.subtle">
        <PageState>모임 정보를 불러오지 못했어요.</PageState>
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
        isDeleting={deleteMutation.isPending}
        isSubmitting={updateMutation.isPending}
        mode={EVENT_FORM_MODES.EDIT}
        submitDisabled={!isFormSubmittable}
        onBack={handleBack}
        onCancelBack={handleCancelBack}
        onConfirmBack={handleConfirmBack}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
      />
      <ConfirmPopup
        confirmLoading={deleteMutation.isPending}
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
