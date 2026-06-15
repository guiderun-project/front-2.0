import type { ReactElement } from 'react';

import {
  PageLayout,
  Tabs,
  TopNavigation,
  type TopNavigationIconButtonProps,
} from '@/components';

import { ApplicantFormSheet } from './components/ApplicantFormSheet';
import { ApplicantsPanel } from './components/ApplicantsPanel';
import { DetailPanel } from './components/DetailPanel';
import { EventDetailCta } from './components/EventDetailCta';
import { EventHero } from './components/EventHero';
import { ManagementMenuSheet } from './components/ManagementMenuSheet';
import { MatchingPanel } from './components/MatchingPanel';
import { PageState } from './components/PanelState';
import { RestrictedAccessSheet } from './components/RestrictedAccessSheet';
import { EVENT_DETAIL_TABS } from './constants';
import { useEventApplicants } from './hooks/useEventApplicants';
import { useEventDetailPage } from './hooks/useEventDetailPage';
import { useEventMatchingStatus } from './hooks/useEventMatchingStatus';

export const EventDetailPage = (): ReactElement => {
  const {
    activeTab,
    canAccessProtectedTabs,
    canManageEvent,
    closeManagementSheet,
    closeRestrictedSheet,
    event,
    eventDetailQuery,
    eventId,
    handleBack,
    handleCopyLink,
    handleKakaoShare,
    handleLogin,
    handleTabSelectionChange,
    isApprovalPending,
    isAuthenticated,
    isManagementSheetOpen,
    isRestrictedSheetOpen,
    isValidEventId,
    openManagementSheet,
    openRestrictedSheet,
  } = useEventDetailPage();
  const matchingStatus = useEventMatchingStatus({
    eventId,
    enabled:
      isValidEventId && canAccessProtectedTabs && activeTab === 'matching',
  });
  const {
    applicantFormQuery,
    applicantsQuery,
    closeApplicantForm,
    openApplicantForm,
    selectedApplicantId,
  } = useEventApplicants({
    activeTab,
    canViewApplicantForm: canManageEvent,
    canViewApplicants: canAccessProtectedTabs,
    eventId,
  });
  const navigationLeftAction: TopNavigationIconButtonProps = {
    icon: 'chevron-left-lined',
    ariaLabel: '뒤로가기',
    onClick: handleBack,
  };
  const navigationRightActions: TopNavigationIconButtonProps[] = [
    {
      icon: 'share-lined',
      ariaLabel: '카카오톡 공유하기 새창 열림',
      onClick: handleKakaoShare,
    },
    ...(canManageEvent
      ? [
          {
            icon: 'more-vertical-lined',
            ariaLabel: '더보기',
            onClick: openManagementSheet,
          } satisfies TopNavigationIconButtonProps,
        ]
      : []),
  ];

  if (!isValidEventId) {
    return (
      <PageLayout background="gradient.bg.brand-event">
        <TopNavigation
          aria-label="이벤트 상세 상단 메뉴"
          left={navigationLeftAction}
          right={navigationRightActions}
        />
        <PageState>이벤트 주소가 올바르지 않습니다.</PageState>
      </PageLayout>
    );
  }

  if (eventDetailQuery.isPending) {
    return (
      <PageLayout background="gradient.bg.brand-event">
        <TopNavigation
          aria-label="이벤트 상세 상단 메뉴"
          left={navigationLeftAction}
          right={navigationRightActions}
        />
        <PageState>이벤트 정보를 불러오는 중입니다.</PageState>
      </PageLayout>
    );
  }

  if (eventDetailQuery.isError || !event) {
    return (
      <PageLayout background="gradient.bg.brand-event">
        <TopNavigation
          aria-label="이벤트 상세 상단 메뉴"
          left={navigationLeftAction}
          right={navigationRightActions}
        />
        <PageState>이벤트를 찾을 수 없습니다.</PageState>
      </PageLayout>
    );
  }

  return (
    <PageLayout background="gradient.bg.brand-event">
      <TopNavigation
        aria-label="이벤트 상세 상단 메뉴"
        left={navigationLeftAction}
        right={navigationRightActions}
      />
      <EventHero event={event} />

      <Tabs selectedKey={activeTab} onSelectionChange={handleTabSelectionChange}>
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
              eventCategory={event.eventCategory}
              eventType={event.eventType}
              isError={applicantsQuery.isError}
              isPending={applicantsQuery.isPending}
              onApplicantClick={canManageEvent ? openApplicantForm : undefined}
            />
          </Tabs.Panel>
          <Tabs.Panel id="matching">
            <MatchingPanel
              data={matchingStatus.data}
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
        canManageEvent={canManageEvent}
        event={event}
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
        eventDate={event.schedule.date}
        eventId={eventId}
        eventName={event.name}
        open={isManagementSheetOpen}
        onClose={closeManagementSheet}
      />
      <ApplicantFormSheet
        data={applicantFormQuery.data}
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
