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
} & Omit<AriaTabsProps, 'children' | 'orientation'>;

export type TabsListProps = {
  children: ReactNode;
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
