import type { ReactElement } from "react";

import {
  PageLayout,
  Tabs,
  TopNavigation,
  type TopNavigationIconButtonProps,
} from "@/components";

import { ApplicantFormSheet } from "./components/ApplicantFormSheet";
import { ApplicantsPanel } from "./components/ApplicantsPanel";
import { DetailPanel } from "./components/DetailPanel";
import { EventDetailCta } from "./components/EventDetailCta";
import { EventHero } from "./components/EventHero";
import { ManagementMenuSheet } from "./components/ManagementMenuSheet";
import { MatchingPanel } from "./components/MatchingPanel";
import { PageState } from "./components/PanelState";
import { RestrictedAccessSheet } from "./components/RestrictedAccessSheet";
import { TrainingSafetyPermissionSheet } from "./components/TrainingSafetyPermissionSheet";
import { EVENT_DETAIL_TABS } from "./constants";
import { useEventApplicants } from "./hooks/useEventApplicants";
import { useEventDetailPage } from "./hooks/useEventDetailPage";
import { useEventMatchingStatus } from "./hooks/useEventMatchingStatus";
import { useNavigate } from "react-router-dom";

export const EventDetailPage = (): ReactElement => {
  const navigate = useNavigate();
  const {
    activeTab,
    canAccessProtectedTabs,
    canExtractAttendanceList,
    canManageEventActions,
    canManagePost,
    canOpenManagementSheet,
    closeManagementSheet,
    closeRestrictedSheet,
    closeTrainingSafetySheet,
    event,
    eventId,
    handleApply,
    handleBack,
    handleCopyLink,
    handleKakaoShare,
    handleLogin,
    handleTabSelectionChange,
    handleTrainingSafetyAgreement,
    isApprovalPending,
    isApplyPermissionChecking,
    isAuthenticated,
    isOrganizer,
    isManagementSheetOpen,
    isRestrictedSheetOpen,
    isTrainingSafetyAgreementPending,
    isTrainingSafetySheetOpen,
    isValidEventId,
    openManagementSheet,
    openRestrictedSheet,
    shouldShowOperationActionsInMenu,
  } = useEventDetailPage();
  const matchingStatus = useEventMatchingStatus({
    eventId,
    enabled:
      isValidEventId && canAccessProtectedTabs && activeTab === "matching",
  });
  const {
    applicantFormQuery,
    applicantsQuery,
    closeApplicantForm,
    openApplicantForm,
    selectedApplicantId,
  } = useEventApplicants({
    activeTab,
    canViewApplicantForm: canManageEventActions,
    canViewApplicants: canAccessProtectedTabs,
    eventId,
  });
  const navigationLeftAction: TopNavigationIconButtonProps = {
    icon: "chevron-left-lined",
    ariaLabel: "뒤로가기",
    onClick: handleBack,
  };
  const navigationRightActions: TopNavigationIconButtonProps[] = [
    {
      icon: "home-lined",
      ariaLabel: "홈으로 이동",
      onClick: () => navigate("/"),
    },
    {
      icon: "share-lined",
      ariaLabel: "카카오톡 공유하기 새창 열림",
      onClick: handleKakaoShare,
    },
    ...(canOpenManagementSheet
      ? [
          {
            icon: "more-vertical-lined",
            ariaLabel: "더보기",
            onClick: openManagementSheet,
          } satisfies TopNavigationIconButtonProps,
        ]
      : []),
  ];

  if (!isValidEventId) {
    return (
      <PageLayout
        background="bg.brand-event"
        gradient="gradient.bg.brand-event"
      >
        <TopNavigation
          aria-label="이벤트 상세 상단 메뉴"
          left={navigationLeftAction}
          right={navigationRightActions}
        />
        <PageState>이벤트 주소가 올바르지 않습니다.</PageState>
      </PageLayout>
    );
  }

  return (
    <PageLayout background="bg.brand-event" gradient="gradient.bg.brand-event">
      <TopNavigation
        aria-label="이벤트 상세 상단 메뉴"
        left={navigationLeftAction}
        right={navigationRightActions}
      />
      <EventHero event={event} />

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={handleTabSelectionChange}
      >
        <Tabs.List>
          {EVENT_DETAIL_TABS.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id="detail">
            <DetailPanel
              canShowComments={canAccessProtectedTabs}
              event={event}
              onCopyLink={handleCopyLink}
              onKakaoShare={handleKakaoShare}
            />
          </Tabs.Panel>
          <Tabs.Panel id="applicants">
            <ApplicantsPanel
              data={applicantsQuery.data}
              error={applicantsQuery.error}
              eventCategory={event.eventCategory}
              eventType={event.eventType}
              isError={applicantsQuery.isError}
              isPending={applicantsQuery.isPending}
              onApplicantClick={
                canManageEventActions ? openApplicantForm : undefined
              }
            />
          </Tabs.Panel>
          <Tabs.Panel id="matching">
            <MatchingPanel
              data={matchingStatus.data}
              error={matchingStatus.error}
              eventCategory={event.eventCategory}
              eventType={event.eventType}
              isError={matchingStatus.isError}
              isPending={matchingStatus.isPending}
              showMyPartnerSummary={event.viewer?.isApplied === true}
            />
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>

      <EventDetailCta
        canAccessProtectedTabs={canAccessProtectedTabs}
        event={event}
        isApplyPermissionChecking={isApplyPermissionChecking}
        isEventOrganizer={isOrganizer}
        onApply={handleApply}
        onRestrictedAccess={openRestrictedSheet}
      />

      <RestrictedAccessSheet
        isApprovalPending={isApprovalPending}
        isAuthenticated={isAuthenticated}
        open={isRestrictedSheetOpen}
        onClose={closeRestrictedSheet}
        onLogin={handleLogin}
      />
      <ManagementMenuSheet
        canExtractAttendanceList={canExtractAttendanceList}
        canManagePost={canManagePost}
        eventDate={event.schedule.date}
        eventId={eventId}
        eventName={event.name}
        open={isManagementSheetOpen}
        recruitStatus={event.recruitStatus}
        showOperationActions={shouldShowOperationActionsInMenu}
        onClose={closeManagementSheet}
      />
      <TrainingSafetyPermissionSheet
        isSubmitting={isTrainingSafetyAgreementPending}
        open={isTrainingSafetySheetOpen}
        onAgree={handleTrainingSafetyAgreement}
        onClose={closeTrainingSafetySheet}
      />
      <ApplicantFormSheet
        data={applicantFormQuery.data}
        error={applicantFormQuery.error}
        eventCategory={event.eventCategory}
        eventType={event.eventType}
        isError={applicantFormQuery.isError}
        isPending={applicantFormQuery.isPending}
        open={selectedApplicantId !== null}
        onClose={closeApplicantForm}
      />
    </PageLayout>
  );
};
