import type { Key, ReactElement } from 'react';

import styled from '@emotion/styled';

import { Tabs } from '@/components';

import type { MatchMessageState } from '../matchPageState';
import type { EventMatchPageModel, MatchTabId } from '../useEventMatchPage';
import { MatchCompletedPanel } from './MatchCompletedPanel';
import { MatchSelectionBar } from './MatchSelectionBar';
import { PanelState } from './MatchStates';
import { MatchWaitingPanel } from './MatchWaitingPanel';

type MatchMessageContentProps = {
  pageState: MatchMessageState;
};

type MatchPageContentProps = {
  matchPage: EventMatchPageModel;
};

const MATCH_TAB_ID = {
  WAITING: 'waiting',
  COMPLETED: 'completed',
} as const satisfies Record<string, MatchTabId>;

const MATCH_TAB_IDS: ReadonlySet<Key> = new Set(Object.values(MATCH_TAB_ID));

const isMatchTabId = (key: Key): key is MatchTabId => {
  return MATCH_TAB_IDS.has(key);
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
  matchPage,
}: MatchPageContentProps): ReactElement => {
  const {
    activeTab,
    canCreateMatching,
    cancelMatching,
    cancelingViId,
    clearSelection,
    createMatching,
    hasVisibleSelectionBar,
    isCancelingMatching,
    isCreatingMatching,
    pageState,
    selectedGuides,
    selectedUserIds,
    selectedVi,
    setActiveTab,
    toggleParticipant,
  } = matchPage;

  const handleSelectionChange = (key: Key) => {
    if (isMatchTabId(key)) {
      setActiveTab(key);
    }
  };

  return (
    <ReadyContent $hasSelectionBar={hasVisibleSelectionBar}>
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={handleSelectionChange}
      >
        <Tabs.List>
          <Tabs.Tab id={MATCH_TAB_ID.WAITING}>매칭 대기</Tabs.Tab>
          <Tabs.Tab id={MATCH_TAB_ID.COMPLETED}>매칭 완료</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id={MATCH_TAB_ID.WAITING}>
            <TabPanelContent>
              <MatchWaitingPanel
                disabledParticipantAction={isCreatingMatching}
                selectedUserIds={selectedUserIds}
                waiting={pageState.waiting}
                onToggleParticipant={toggleParticipant}
              />
            </TabPanelContent>
          </Tabs.Panel>
          <Tabs.Panel id={MATCH_TAB_ID.COMPLETED}>
            <TabPanelContent>
              <MatchCompletedPanel
                cancelingViId={cancelingViId}
                completed={pageState.completed}
                isCancelingMatching={isCancelingMatching}
                onCancelMatching={cancelMatching}
              />
            </TabPanelContent>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
      {hasVisibleSelectionBar ? (
        <MatchSelectionBar
          canCreateMatching={canCreateMatching}
          isCreatingMatching={isCreatingMatching}
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
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  padding: `${theme.spacing['2xl']} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
  boxSizing: 'border-box',
}));

const ReadyContent = styled.div<{ $hasSelectionBar: boolean }>(
  ({ $hasSelectionBar, theme }) => ({
    minHeight: '100%',
    paddingBottom: $hasSelectionBar ? theme.pxToRem(176) : theme.spacing.none,
    boxSizing: 'border-box',
    transition: 'padding-bottom 180ms ease-out',

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  }),
);

const TabPanelContent = styled.div(({ theme }) => ({
  padding: `${theme.spacing.xl} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
}));
