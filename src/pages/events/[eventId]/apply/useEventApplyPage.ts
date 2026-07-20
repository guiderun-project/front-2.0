import { useMemo, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { getApiErrorMessage, isNotFoundApiError } from '@/api/core';
import { userQueryKeys } from '@/api/queryKeys';
import { api } from '@/api/services';
import type {
  MyEventApplyGetResponse,
  UserPermissionGetResponse,
} from '@/api/types';
import { useToast } from '@/components';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import { useEventDetailRoute } from '../EventDetailRouteContext';
import {
  eventApplyQueryKeys,
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
} from './utils';
import {
  EMPTY_EVENT_APPLY_FORM_VALUES,
  eventApplyFormSchema,
  type EventApplyFormValues,
} from './schema';

const isNotFoundError = (error: unknown) => {
  return isNotFoundApiError(error);
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
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialEntryRef = useRef(location.key === 'default');
  const queryClient = useQueryClient();
  const { isAuthReady, user } = useAuth();
  const { showToast } = useToast();
  const { event, eventId, isValidEventId } = useEventDetailRoute();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);
  // 제출 실패 횟수. 실패할 때마다 증가시켜 폼이 제출 버튼으로 포커스를
  // 복귀시키는 트리거로 쓴다(버튼 disabled 해제 후 rAF 시점에 수행).
  const [submitErrorCount, setSubmitErrorCount] = useState(0);
  const submitLockRef = useRef(false);
  const viewerKey = getEventDetailViewerKey(user?.userId);

  const myFormQuery = useQuery({
    queryKey: eventApplyQueryKeys.myForm(eventId, viewerKey),
    queryFn: () => getMyFormOrNull(eventId),
    enabled: isValidEventId && isAuthReady && user !== null,
    retry: false,
  });

  const userPermissionQuery = useQuery({
    queryKey: user ? userQueryKeys.permission(user.userId) : userQueryKeys.root,
    queryFn: () => api.user.permissionGet(),
    enabled: isValidEventId && isAuthReady && user !== null,
    retry: false,
    staleTime: Infinity,
  });

  const myForm = myFormQuery.data ?? null;
  const isEditMode = myForm !== null;
  const ineligibleMessage =
    user ? getEventApplyIneligibleMessage(event) : null;
  const defaultValues = useMemo(() => {
    if (!user) {
      return EMPTY_EVENT_APPLY_FORM_VALUES;
    }

    return createEventApplyInitialValues({ event, form: myForm, user });
  }, [event, myForm, user]);

  const form = useForm<EventApplyFormValues>({
    resolver: zodResolver(eventApplyFormSchema),
    shouldFocusError: false,
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

  const navigateBackToDetail = () => {
    if (!isInitialEntryRef.current) {
      navigate(-1);
      return;
    }

    navigate(APP_PATH.EVENT_DETAIL(eventId), { replace: true });
  };

  const handleViewEvent = () => {
    navigate(APP_PATH.EVENT_DETAIL(eventId), { replace: true });
  };

  const createMutation = useMutation({
    mutationFn: (values: EventApplyFormValues) => {
      if (!user) {
        throw new Error('Event application context is missing.');
      }

      const eligibilityError = getEventApplyIneligibleMessage(event);

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
    onError: (error) => {
      window.alert(getApiErrorMessage(error, '참여 신청에 실패했어요.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: EventApplyFormValues) => {
      if (!user) {
        throw new Error('Event application context is missing.');
      }

      const eligibilityError = getEventApplyIneligibleMessage(event);

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
      handleViewEvent();
      window.setTimeout(() => {
        showToast({
          type: 'success',
          icon: 'check-lined',
          content: '신청서 수정이 완료됐어요.',
        });
      }, 0);
    },
    onError: (error) => {
      window.alert(getApiErrorMessage(error, '신청서 수정에 실패했어요.'));
    },
  });

  const trainingSafetyPermissionMutation = useMutation({
    mutationFn: () =>
      api.user.trainingSafetyPermissionPatch({ trainingSafety: true }),
    onSuccess: () => {
      if (!user) {
        return;
      }

      queryClient.setQueryData<UserPermissionGetResponse>(
        userQueryKeys.permission(user.userId),
        { trainingSafety: true },
      );
    },
    onError: (error) => {
      window.alert(
        getApiErrorMessage(
          error,
          '훈련 참여 및 안전 면책 동의를 저장하지 못했어요.',
        ),
      );
    },
  });

  const handleBack = () => {
    navigateBackToDetail();
  };

  const handleTrainingSafetyAgreement = () => {
    if (trainingSafetyPermissionMutation.isPending) {
      return;
    }

    trainingSafetyPermissionMutation.mutate();
  };

  const handleSubmit = (values: EventApplyFormValues) => {
    if (submitLockRef.current) {
      return;
    }

    if (!user) {
      return;
    }

    const eligibilityError = getEventApplyIneligibleMessage(event);

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

    // 실패 카운트 증가는 unlockSubmit 과 같은 렌더에 묶어, 폼의 포커스 복귀
    // effect 가 버튼이 disabled 에서 풀린 뒤에 실행되도록 보장한다.
    const handleSubmitSettled = (_data: unknown, error: unknown) => {
      unlockSubmit();

      if (error) {
        setSubmitErrorCount((previous) => previous + 1);
      }
    };

    if (isEditMode) {
      updateMutation.mutate(values, { onSettled: handleSubmitSettled });
      return;
    }

    createMutation.mutate(values, { onSettled: handleSubmitSettled });
  };

  const isMyFormReady =
    myFormQuery.data !== undefined || myFormQuery.isError || !user;
  const isUserPermissionReady =
    userPermissionQuery.data !== undefined ||
    userPermissionQuery.isError ||
    !user;

  return {
    event,
    eventId,
    form,
    handleBack,
    handleTrainingSafetyAgreement,
    handleViewEvent,
    handleSubmit,
    // 이번 방문에서 방금 면책 동의를 마치고 폼으로 전환됐는지.
    // 폼이 동의 저장 완료를 스크린리더에 안내하는 데 쓴다.
    hasJustAgreedTrainingSafety: trainingSafetyPermissionMutation.isSuccess,
    isAuthReady,
    isCompleted,
    isEditMode,
    ineligibleMessage,
    isMyFormError: myFormQuery.isError,
    isMyFormReady,
    isUserPermissionError: userPermissionQuery.isError,
    isUserPermissionReady,
    isSubmitting:
      isSubmitLocked || createMutation.isPending || updateMutation.isPending,
    isTrainingSafetyAgreementPending:
      trainingSafetyPermissionMutation.isPending,
    isValidEventId,
    needsTrainingSafetyAgreement:
      user !== null && userPermissionQuery.data?.trainingSafety === false,
    submitErrorCount,
    user,
  };
};
