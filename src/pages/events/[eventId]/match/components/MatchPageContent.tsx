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
import { HIGH_CONTRAST_SELECTOR } from '@/styles/highContrastStyles';

type MatchMessageContentProps = {
  pageState: MatchMessageState;
};

type MatchPageContentProps = {
  eventGroupLabelContext: EventGroupLabelContext;
  matchPage: EventMatchPageModel;
};

// 포커스 복구(섹션 제목 낭독)가 끝난 뒤 라이브 리전 안내를 주입하기 위한
// 지연. 포커스 이동과 동시에 주입하면 스크린리더가 안내를 중간에 끊는다.
const FOCUS_ANNOUNCEMENT_DELAY_MS = 700;

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
    announceMatchingCompletion,
    announceSelectionCleared,
    canCreateMatching,
    clearSelection,
    createMatching,
    hasSelection,
    isCreatingMatching,
    matchingSuccessCount,
    pageState,
    selectedGuides,
    selectedUserIds,
    selectedVi,
    toggleParticipant,
  } = matchPage;
  const { activeSection, completedRef, navRef, scrollToSection, waitingRef } =
    useMatchScrollSpy();
  const lastHandledSuccessCountRef = useRef(matchingSuccessCount);
  const clearAnnounceTimeoutRef = useRef<number | undefined>(undefined);

  // 선택 바의 '선택 모두 해제'를 누르면 바가 통째로 언마운트되어 스크린리더
  // 포커스가 body로 떨어지므로, 다음 프레임에 매칭대기 섹션 제목으로 포커스를
  // 옮겨 낭독 커서가 목록 근처에 유지되게 한다. 해제 확인 문구는 제목 낭독이
  // 끝난 뒤 주입해 포커스 낭독에 잘리지 않게 한다(한 이벤트 = 한 낭독 채널).
  const handleClearSelection = () => {
    clearSelection();
    window.requestAnimationFrame(() => {
      waitingRef.current
        ?.querySelector<HTMLElement>("h2")
        ?.focus({ preventScroll: true });
      window.clearTimeout(clearAnnounceTimeoutRef.current);
      clearAnnounceTimeoutRef.current = window.setTimeout(() => {
        announceSelectionCleared();
      }, FOCUS_ANNOUNCEMENT_DELAY_MS);
    });
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(clearAnnounceTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // 성공 카운터가 실제로 증가했을 때만 실행한다. 요청 진행 중 사용자가
    // 선택을 직접 해제한 뒤 요청이 실패하는 경우처럼, 성공이 아닌 전이에서는
    // 포커스를 옮기지 않는다(초기 마운트는 ref 초기값 비교로 건너뜀).
    if (matchingSuccessCount === lastHandledSuccessCountRef.current) {
      return;
    }

    lastHandledSuccessCountRef.current = matchingSuccessCount;

    // 매칭 성공으로 선택 바가 언마운트되면 다음 매칭을 이어갈 매칭대기 섹션
    // 제목으로 포커스를 먼저 복구하고, 완료 안내(이름·남은 인원)는 제목
    // 낭독이 끝난 뒤 polite 리전에 지연 주입해 포커스 이동에 잘리지 않게 한다.
    let announceTimeoutId: number | undefined;
    const frameId = window.requestAnimationFrame(() => {
      waitingRef.current
        ?.querySelector<HTMLElement>("h2")
        ?.focus({ preventScroll: true });
      announceTimeoutId = window.setTimeout(() => {
        announceMatchingCompletion();
      }, FOCUS_ANNOUNCEMENT_DELAY_MS);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(announceTimeoutId);
    };
  }, [announceMatchingCompletion, matchingSuccessCount, waitingRef]);

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

  [HIGH_CONTRAST_SELECTOR]: {
    height: "1px",
  },
}));
