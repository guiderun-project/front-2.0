import { useMemo, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { api } from '@/api/services';
import type { MyEventApplyGetResponse } from '@/api/types';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import {
  eventDetailQueryKeys,
  getEventDetailViewerKey,
} from '../queryKeys';
import {
  getEventApplyIneligibleMessage,
  getEventApplyProfileMissingMessage,
} from './guards';
import {
  createEventApplyInitialValues,
  createEventApplyRequestBody,
} from './mappers';
import {
  EMPTY_EVENT_APPLY_FORM_VALUES,
  eventApplyFormSchema,
  type EventApplyFormValues,
} from './schema';

const eventApplyQueryKeys = {
  myForm: (eventId: number, viewerKey: string) =>
    [...eventDetailQueryKeys.detailRoot(eventId), 'my-form', viewerKey] as const,
};

const isNotFoundError = (error: unknown) => {
  return isAxiosError(error) && error.response?.status === 404;
};

const getMyFormOrNull = async (
  eventId: number,
): Promise<MyEventApplyGetResponse | null> => {
  try {
    return await api.application.myFormGet({ eventId });
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
};

export const useEventApplyPage = () => {
  const { eventId: eventIdParam } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthReady, user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);
  const submitLockRef = useRef(false);
  const eventId = Number(eventIdParam);
  const isValidEventId = Number.isInteger(eventId) && eventId > 0;
  const viewerKey = getEventDetailViewerKey(user?.userId);

  const eventDetailQuery = useQuery({
    queryKey: eventDetailQueryKeys.detail(eventId, viewerKey),
    queryFn: () => api.event.detailGet({ eventId }),
    enabled: isValidEventId && isAuthReady,
  });

  const myFormQuery = useQuery({
    queryKey: eventApplyQueryKeys.myForm(eventId, viewerKey),
    queryFn: () => getMyFormOrNull(eventId),
    enabled: isValidEventId && isAuthReady && user !== null,
    retry: false,
  });

  const event = eventDetailQuery.data ?? null;
  const myForm = myFormQuery.data ?? null;
  const isEditMode = myForm !== null;
  const ineligibleMessage =
    event && user ? getEventApplyIneligibleMessage(event, user) : null;
  const defaultValues = useMemo(() => {
    if (!event || !user) {
      return EMPTY_EVENT_APPLY_FORM_VALUES;
    }

    return createEventApplyInitialValues({ event, form: myForm, user });
  }, [event, myForm, user]);

  const form = useForm<EventApplyFormValues>({
    resolver: zodResolver(eventApplyFormSchema),
    values: defaultValues,
  });

  const invalidateEventQueries = () => {
    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.detailRoot(eventId),
      }),
      queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.applicants(eventId),
      }),
      queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.matchingStatus(eventId),
      }),
      queryClient.invalidateQueries({
        queryKey: eventApplyQueryKeys.myForm(eventId, viewerKey),
      }),
    ]);
  };

  const lockSubmit = () => {
    submitLockRef.current = true;
    setIsSubmitLocked(true);
  };

  const unlockSubmit = () => {
    submitLockRef.current = false;
    setIsSubmitLocked(false);
  };

  const createMutation = useMutation({
    mutationFn: (values: EventApplyFormValues) => {
      if (!event || !user) {
        throw new Error('Event application context is missing.');
      }

      const eligibilityError = getEventApplyIneligibleMessage(event, user);

      if (eligibilityError) {
        throw new Error(eligibilityError);
      }

      return api.application.createPost({
        eventId,
        body: createEventApplyRequestBody({ event, values, user }),
      });
    },
    onSuccess: () => {
      void invalidateEventQueries();
      setIsCompleted(true);
    },
    onError: () => {
      window.alert('참여 신청에 실패했어요.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: EventApplyFormValues) => {
      if (!event || !user) {
        throw new Error('Event application context is missing.');
      }

      const eligibilityError = getEventApplyIneligibleMessage(event, user);

      if (eligibilityError) {
        throw new Error(eligibilityError);
      }

      return api.application.updatePatch({
        eventId,
        body: createEventApplyRequestBody({ event, values, user }),
      });
    },
    onSuccess: () => {
      void invalidateEventQueries();
      navigate(APP_PATH.EVENT_DETAIL(eventId));
      window.setTimeout(() => {
        // TODO: Toast 적용 필요
        window.alert('신청서 수정이 완료됐어요.');
      }, 0);
    },
    onError: () => {
      window.alert('신청서 수정에 실패했어요.');
    },
  });

  const handleBack = () => {
    navigate(APP_PATH.EVENT_DETAIL(eventId));
  };

  const handleSubmit = (values: EventApplyFormValues) => {
    if (submitLockRef.current) {
      return;
    }

    if (!event || !user) {
      return;
    }

    const eligibilityError = getEventApplyIneligibleMessage(event, user);

    if (eligibilityError) {
      window.alert(eligibilityError);
      return;
    }

    const profileError = getEventApplyProfileMissingMessage(event, user);

    if (profileError) {
      window.alert(profileError);
      return;
    }

    lockSubmit();

    if (isEditMode) {
      updateMutation.mutate(values, { onSettled: unlockSubmit });
      return;
    }

    createMutation.mutate(values, { onSettled: unlockSubmit });
  };

  const isMyFormReady =
    myFormQuery.data !== undefined || myFormQuery.isError || !user;

  return {
    event,
    eventDetailQuery,
    eventId,
    form,
    handleBack,
    handleSubmit,
    isAuthReady,
    isCompleted,
    isEditMode,
    ineligibleMessage,
    isMyFormError: myFormQuery.isError,
    isMyFormReady,
    isSubmitting:
      isSubmitLocked || createMutation.isPending || updateMutation.isPending,
    isValidEventId,
    user,
  };
};
