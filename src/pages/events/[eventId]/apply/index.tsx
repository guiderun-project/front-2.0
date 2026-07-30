import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

import { TrainingSafetyPermissionSheet } from '../components/TrainingSafetyPermissionSheet';
import { EventApplyCompleted } from './EventApplyCompleted';
import { EventApplyForm } from './EventApplyForm';
import { useEventApplyPage } from './useEventApplyPage';

export const EventApplyPage = (): ReactElement => {
  const {
    event,
    form,
    handleBack,
    handleTrainingSafetyAgreement,
    handleViewEvent,
    handleSubmit,
    hasJustAgreedTrainingSafety,
    isAuthReady,
    isCompleted,
    isEditMode,
    ineligibleMessage,
    isMyFormError,
    isMyFormReady,
    isSubmitting,
    isTrainingSafetyAgreementPending,
    isUserPermissionError,
    isUserPermissionReady,
    isValidEventId,
    needsTrainingSafetyAgreement,
    submitErrorCount,
    user,
  } = useEventApplyPage();

  if (!isValidEventId) {
    return (
      <PageLayout background="bg.subtle">
        <RoutePlaceholder
          status
          title="잘못된 이벤트 주소예요"
          description="이벤트 주소를 다시 확인해주세요."
        />
      </PageLayout>
    );
  }

  if (!isAuthReady || !isMyFormReady || !isUserPermissionReady) {
    return (
      <PageLayout background="bg.subtle">
        <RoutePlaceholder
          status
          title="신청 정보를 불러오고 있어요"
          description="잠시만 기다려주세요."
        />
      </PageLayout>
    );
  }

  if (isMyFormError) {
    return (
      <PageLayout background="bg.subtle">
        <RoutePlaceholder
          status
          title="신청 정보를 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
        />
      </PageLayout>
    );
  }

  if (isUserPermissionError) {
    return (
      <PageLayout background="bg.subtle">
        <RoutePlaceholder
          status
          title="권한 정보를 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
        />
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout background="bg.subtle">
        <RoutePlaceholder
          status
          title="로그인이 필요해요"
          description="로그인 후 이벤트 신청을 진행해주세요."
        />
      </PageLayout>
    );
  }

  if (isCompleted) {
    return (
      <EventApplyCompleted
        event={event}
        onBack={handleViewEvent}
        onViewEvent={handleViewEvent}
      />
    );
  }

  if (ineligibleMessage) {
    return (
      <PageLayout background="bg.subtle">
        <RoutePlaceholder
          status
          title="참여 신청이 불가해요"
          description={ineligibleMessage}
        />
      </PageLayout>
    );
  }

  if (needsTrainingSafetyAgreement) {
    return (
      <PageLayout background="bg.subtle">
        <TrainingSafetyPermissionSheet
          isSubmitting={isTrainingSafetyAgreementPending}
          open
          onAgree={handleTrainingSafetyAgreement}
          onClose={handleBack}
        />
      </PageLayout>
    );
  }

  return (
    <EventApplyForm
      event={event}
      form={form}
      hasJustAgreedTrainingSafety={hasJustAgreedTrainingSafety}
      isEditMode={isEditMode}
      isSubmitting={isSubmitting}
      submitErrorCount={submitErrorCount}
      user={user}
      onBack={handleBack}
      onSubmit={handleSubmit}
    />
  );
};
