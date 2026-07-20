import { useEffect, useRef, useState, type ReactElement } from "react";

import styled from "@emotion/styled";

import { Text } from "@/components";

import type { EventGroupLabelContext } from "../../utils";
import type { MatchMessageState } from "../matchPageState";
import type { EventMatchPageModel } from "../useEventMatchPage";
import { useMatchScrollSpy } from "../useMatchScrollSpy";
import { MatchCompletedPanel } from "./MatchCompletedPanel";
import { MatchSegmentNav } from "./MatchSegmentNav";
import { MatchSelectionBar } from "./MatchSelectionBar";
import { PanelState } from "./MatchStates";
import { MatchWaitingPanel } from "./MatchWaitingPanel";

type MatchMessageContentProps = {
  pageState: MatchMessageState;
};

type MatchPageContentProps = {
  eventGroupLabelContext: EventGroupLabelContext;
  matchPage: EventMatchPageModel;
};

export const MatchPageMessageContent = ({
  pageState,
}: MatchMessageContentProps): ReactElement => {
  // 라이브 리전은 비어 있는 상태로 먼저 마운트한 뒤 다음 프레임에 메시지를
  // 채워야 status/alert 변경이 스크린리더에 안정적으로 안내된다.
  const [announcedMessage, setAnnouncedMessage] = useState("");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setAnnouncedMessage(pageState.message);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pageState.message]);

  return (
    <Content>
      <PanelState role={pageState.role}>{announcedMessage}</PanelState>
    </Content>
  );
};

export const MatchPageContent = ({
  eventGroupLabelContext,
  matchPage,
}: MatchPageContentProps): ReactElement => {
  const {
    canCreateMatching,
    clearSelection,
    createMatching,
    hasSelection,
    isCreatingMatching,
    pageState,
    selectedGuides,
    selectedUserIds,
    selectedVi,
    toggleParticipant,
  } = matchPage;
  const { activeSection, completedRef, navRef, scrollToSection, waitingRef } =
    useMatchScrollSpy();
  const wasCreatingMatchingRef = useRef(false);

  // 선택 바의 '선택 모두 해제'를 누르면 바가 통째로 언마운트되어 스크린리더
  // 포커스가 body로 떨어지므로, 다음 프레임에 매칭대기 섹션 제목으로 포커스를
  // 옮겨 낭독 커서가 목록 근처에 유지되게 한다.
  const handleClearSelection = () => {
    clearSelection();
    window.requestAnimationFrame(() => {
      waitingRef.current
        ?.querySelector<HTMLElement>("h2")
        ?.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    const wasCreatingMatching = wasCreatingMatchingRef.current;
    wasCreatingMatchingRef.current = isCreatingMatching;

    // 매칭 요청이 성공했을 때만 선택이 비워진다(실패 시 선택 유지). 성공으로
    // 선택 바가 언마운트되면 다음 매칭을 이어갈 매칭대기 섹션 제목으로
    // 포커스를 복구한다. rAF 지연으로 완료 안내(assertive)와의 경합을 줄인다.
    if (!wasCreatingMatching || isCreatingMatching || hasSelection) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      waitingRef.current
        ?.querySelector<HTMLElement>("h2")
        ?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [hasSelection, isCreatingMatching, waitingRef]);

  return (
    <ReadyContent $hasSelectionBar={hasSelection}>
      <MatchSegmentNav
        activeSection={activeSection}
        navRef={navRef}
        onSelect={scrollToSection}
      />

      <Section ref={waitingRef}>
        <SectionHeader>
          <Text as="h2" color="text.tertiary" font="body-m-m" tabIndex={-1}>
            매칭대기
          </Text>
        </SectionHeader>
        <MatchWaitingPanel
          eventGroupLabelContext={eventGroupLabelContext}
          selectedUserIds={selectedUserIds}
          waiting={pageState.waiting}
          onToggleParticipant={toggleParticipant}
        />
      </Section>

      <SectionDivider aria-hidden={true} />

      <Section ref={completedRef}>
        <SectionHeader>
          <Text as="h2" color="text.tertiary" font="body-m-m" tabIndex={-1}>
            매칭완료
          </Text>
        </SectionHeader>
        <MatchCompletedPanel
          completed={pageState.completed}
          eventGroupLabelContext={eventGroupLabelContext}
          selectedUserIds={selectedUserIds}
          onToggleParticipant={toggleParticipant}
        />
      </Section>

      {hasSelection ? (
        <MatchSelectionBar
          canCreateMatching={canCreateMatching}
          isCreatingMatching={isCreatingMatching}
          selectedGuides={selectedGuides}
          selectedVi={selectedVi}
          onClear={handleClearSelection}
          onCreateMatching={createMatching}
        />
      ) : null}
    </ReadyContent>
  );
};

const Content = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100%",
  padding: `${theme.spacing["2xl"]} ${theme.spacing["2xl"]} ${theme.spacing["4xl"]}`,
  boxSizing: "border-box",
}));

const ReadyContent = styled.div<{ $hasSelectionBar: boolean }>(
  ({ $hasSelectionBar, theme }) => ({
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    paddingBottom: $hasSelectionBar ? theme.pxToRem(176) : theme.spacing.none,
    boxSizing: "border-box",
    transition: "padding-bottom 180ms ease-out",

    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  }),
);

const Section = styled.section(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  padding: `${theme.spacing.lg} ${theme.spacing["2xl"]} ${theme.spacing["4xl"]}`,
  boxSizing: "border-box",
}));

const SectionHeader = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  minWidth: 0,
}));

const SectionDivider = styled.div(({ theme }) => ({
  width: "100%",
  height: theme.spacing.lg,
  backgroundColor: theme.color.border.subtle,
}));
