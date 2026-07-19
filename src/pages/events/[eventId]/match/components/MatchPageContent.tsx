import type { ReactElement } from "react";

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
  return (
    <Content>
      <PanelState role={pageState.role}>{pageState.message}</PanelState>
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
    pageState,
    selectedGuides,
    selectedUserIds,
    selectedVi,
    toggleParticipant,
  } = matchPage;
  const { activeSection, completedRef, navRef, scrollToSection, waitingRef } =
    useMatchScrollSpy();

  return (
    <ReadyContent $hasSelectionBar={hasSelection}>
      <MatchSegmentNav
        activeSection={activeSection}
        navRef={navRef}
        onSelect={scrollToSection}
      />

      <Section ref={waitingRef}>
        <SectionHeader>
          <Text as="h2" color="text.tertiary" font="body-m-m">
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
          <Text as="h2" color="text.tertiary" font="body-m-m">
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
          selectedGuides={selectedGuides}
          selectedVi={selectedVi}
          onClear={clearSelection}
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
