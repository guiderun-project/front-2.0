import type { ReactNode } from 'react';

import type {
  Key,
  TabListProps as AriaTabListProps,
  TabPanelProps as AriaTabPanelProps,
  TabPanelsProps as AriaTabPanelsProps,
  TabProps as AriaTabProps,
  TabsProps as AriaTabsProps,
} from 'react-aria-components';

export type TabsLayout = 'equal' | 'hug' | 'scrollable';

export type TabsProps = {
  children: ReactNode;
  fullWidth?: boolean;
  layout?: TabsLayout;
  /**
   * 탭 목록(tablist)의 접근 가능한 이름. 스크린리더가 무엇을 구분하는 탭인지
   * 안내할 수 있도록 지정을 권장한다. Tabs.List 에 aria-label 이 없으면 이 값이
   * tablist 에 적용된다.
   */
  'aria-label'?: string;
} & Omit<AriaTabsProps, 'children' | 'orientation'>;

export type TabsListProps = {
  children: ReactNode;
  /**
   * 탭 목록(tablist)의 접근 가능한 이름. 지정하지 않으면 Tabs 루트의
   * aria-label 을 사용한다.
   */
  'aria-label'?: string;
} & Omit<AriaTabListProps<object>, 'children' | 'dependencies' | 'items'>;

export type TabsTabProps = {
  children: ReactNode;
  id: Key;
} & Omit<AriaTabProps, 'children' | 'id'>;

export type TabsPanelsProps = {
  children: ReactNode;
} & Omit<AriaTabPanelsProps<object>, 'children' | 'dependencies' | 'items'>;

export type TabsPanelProps = {
  children: ReactNode;
  id: Key;
  keepMounted?: boolean;
} & Omit<AriaTabPanelProps, 'children' | 'id' | 'shouldForceMount'>;
