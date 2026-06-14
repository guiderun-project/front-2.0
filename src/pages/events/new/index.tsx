import { useEffect, useMemo, useState, type ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { EventType } from '@/api/types';
import { api } from '@/api/services';
import { BottomSheet, Button, PageLayout } from '@/components';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys } from '../[eventId]/queryKeys';
import { EventForm } from '../form/EventForm';
import { EVENT_FORM_MODES } from '../form/constants';
import {
  createEventFormSchema,
  type EventFormValues,
} from '../form/schema';
import {
  addHoursToTime,
  createDefaultEventFormValues,
  createEventCreateRequest,
  getCurrentTimeValue,
  getEventTypeFromQueryValue,
  getQueryValueFromEventType,
  getTodayDateValue,
  isValidDateValue,
  isValidTimeValue,
} from '../form/utils';

export const EventNewPage = (): ReactElement => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
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
    defaultValues: createDefaultEventFormValues(fallbackEventType),
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
  const createMutation = useMutation({
    mutationFn: (values: EventFormValues) => {
      if (!eventType) {
        throw new Error('Event type is required.');
      }

      return api.event.createPost(
        createEventCreateRequest({ eventType, values }),
      );
    },
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.root,
      });
      navigate(APP_PATH.EVENT_DETAIL(response.eventId));
    },
    onError: () => {
      window.alert('모임 만들기에 실패했어요.');
    },
  });

  useEffect(() => {
    form.reset(createDefaultEventFormValues(fallbackEventType));
  }, [fallbackEventType, form]);

  useEffect(() => {
    if (
      isValidDateValue(date) &&
      date >= createdDate &&
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

  const handleSelectEventType = (nextEventType: EventType) => {
    setSearchParams(
      { type: getQueryValueFromEventType(nextEventType) },
      { replace: true },
    );
  };

  const handleCloseTypeSheet = () => {
    navigate(APP_PATH.HOME);
  };

  const handleBack = () => {
    if (isDirty) {
      setIsBackConfirmOpen(true);
      return;
    }

    navigate(APP_PATH.HOME);
  };

  const handleCancelBack = () => {
    setIsBackConfirmOpen(false);
  };

  const handleConfirmBack = () => {
    navigate(APP_PATH.HOME);
  };

  const handleSubmit = (values: EventFormValues) => {
    createMutation.mutate(values);
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
        isSubmitting={createMutation.isPending}
        mode={EVENT_FORM_MODES.CREATE}
        submitDisabled={!isFormSubmittable}
        onBack={handleBack}
        onCancelBack={handleCancelBack}
        onConfirmBack={handleConfirmBack}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
};

const TypeActionGroup = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.md,
  padding: `${theme.spacing.lg} ${theme.spacing['2xl']} ${theme.spacing['2xl']}`,
}));
