import { useEffect, useRef, type ReactElement } from "react";

import styled from "@emotion/styled";

import { ANALYTICS_EVENT, trackEvent } from "@/api/core";
import type { EventDetailResponse } from "@/api/types";
import {
  FooterButton,
  Graphic,
  HiddenText,
  PageLayout,
  Text,
  TopNavigation,
} from "@/components";

import { focusFirstHeading } from "./focusFirstHeading";
import { createGoogleCalendarEventUrl } from "./googleCalendar";

type EventApplyCompletedProps = {
  event: EventDetailResponse;
  onBack: () => void;
  onViewEvent: () => void;
};

// 완료 화면의 이탈 경로는 이벤트 하나로 모으고 action 으로만 구분한다.
type CompletedAction =
  | "back"
  | "view_event_top_nav"
  | "add_calendar"
  | "view_event_footer";

export const EventApplyCompleted = ({
  event,
  onBack,
  onViewEvent,
}: EventApplyCompletedProps): ReactElement => {
  const completedContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    focusFirstHeading(completedContentRef.current);
  }, []);

  const trackCompletedAction = (action: CompletedAction) => {
    trackEvent(ANALYTICS_EVENT.APPLICATION_COMPLETED_ACTION, {
      eventId: event.eventId,
      action,
    });
  };

  const handleBack = () => {
    trackCompletedAction("back");
    onBack();
  };

  const handleViewEventFromTopNav = () => {
    trackCompletedAction("view_event_top_nav");
    onViewEvent();
  };

  const handleViewEventFromFooter = () => {
    trackCompletedAction("view_event_footer");
    onViewEvent();
  };

  const handleAddGoogleCalendar = () => {
    trackCompletedAction("add_calendar");

    const calendarUrl = createGoogleCalendarEventUrl(event);
    const calendarWindow = window.open("", "_blank");

    if (calendarWindow) {
      calendarWindow.opener = null;
      calendarWindow.location.href = calendarUrl;
      return;
    }

    window.location.assign(calendarUrl);
  };

  return (
    <PageLayout background="bg.default">
      <CompletedPage>
        <TopNavigation
          left={{
            ariaLabel: "이전 페이지로 이동",
            icon: "chevron-left-lined",
            onClick: handleBack,
          }}
          right={[
            {
              ariaLabel: "이벤트 상세로 이동",
              icon: "delete-lined",
              onClick: handleViewEventFromTopNav,
            },
          ]}
        />
        <CompletedContent ref={completedContentRef}>
          <Graphic aria-hidden={true} color="icon.primary" graphic="congrats" />
          <Text as="h1" align="center" color="text.primary" font="heading-m-sb">
            참여 신청이 완료됐어요!
          </Text>
          <Description color="text.secondary" font="body-m-m" align="center">
            모임에 참여하기 전,
            {"\n"}
            함께 달릴 파트너를 확인해주세요.
          </Description>
        </CompletedContent>
        <FooterButton ratio="100:100">
          <FooterButton.Button
            level="secondary"
            size="l"
            onClick={handleAddGoogleCalendar}
          >
            구글 캘린더에 일정 저장
            <HiddenText>새창 열림</HiddenText>
          </FooterButton.Button>
          <FooterButton.Button size="l" onClick={handleViewEventFromFooter}>
            신청한 모임 보기
          </FooterButton.Button>
        </FooterButton>
      </CompletedPage>
    </PageLayout>
  );
};

const CompletedPage = styled.div({
  position: "relative",
  minHeight: "100dvh",
  overflow: "hidden",
});

const CompletedContent = styled.section(({ theme }) => ({
  display: "grid",
  justifyItems: "center",
  gap: theme.spacing.lg,
  padding: `${theme.spacing["2xl"]} ${theme.spacing["2xl"]} ${theme.spacing["6xl"]}`,
  textAlign: "center",
}));

const Description = styled(Text)({
  whiteSpace: "pre-line",
});
