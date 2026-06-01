import type { ReactElement, ReactNode } from 'react';
import {
  Children,
  Fragment,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import styled from '@emotion/styled';
import {
  SelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  TabPanels as AriaTabPanels,
  Tabs as AriaTabs,
  type Key,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabPanelsProps as AriaTabPanelsProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components';

import { HiddenText } from '@/components/HiddenText';

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
  'aria-posinset'?: number;
  'aria-setsize'?: number;
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

type TabsContextValue = {
  layout: TabsLayout;
};

type TabsComponent = ((props: TabsProps) => ReactElement) & {
  List: (props: TabsListProps) => ReactElement;
  Tab: (props: TabsTabProps) => ReactElement;
  Panels: (props: TabsPanelsProps) => ReactElement;
  Panel: (props: TabsPanelProps) => ReactElement;
};

const DEFAULT_LAYOUT = 'equal' satisfies TabsLayout;
const DEFAULT_FULL_WIDTH = true;
const TAB_MIN_WIDTH = 72;

const TabsStyleContext = createContext<TabsContextValue>({
  layout: DEFAULT_LAYOUT,
});

const useTabsStyle = () => useContext(TabsStyleContext);

const TabsRoot = ({
  children,
  fullWidth = DEFAULT_FULL_WIDTH,
  layout = DEFAULT_LAYOUT,
  ...props
}: TabsProps): ReactElement => {
  const contextValue = useMemo(() => ({ layout }), [layout]);

  return (
    <TabsStyleContext.Provider value={contextValue}>
      <StyledTabs $fullWidth={fullWidth} $layout={layout} orientation="horizontal" {...props}>
        {children}
      </StyledTabs>
    </TabsStyleContext.Provider>
  );
};

const TabsList = ({ children, ...props }: TabsListProps): ReactElement => {
  const { layout } = useTabsStyle();
  const childrenWithSetMetadata = useMemo(() => addTabSetMetadata(children), [children]);

  return (
    <StyledTabList $layout={layout} {...props}>
      {childrenWithSetMetadata}
    </StyledTabList>
  );
};

const TabsTab = ({
  'aria-posinset': positionInSet,
  'aria-setsize': setSize,
  children,
  ...props
}: TabsTabProps): ReactElement => {
  const { layout } = useTabsStyle();
  const tabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layout !== 'scrollable') {
      return;
    }

    const tab = tabRef.current;
    if (!tab) {
      return;
    }

    const scrollSelectedTabIntoView = () => {
      if (!tab.hasAttribute('data-selected')) {
        return;
      }

      tab.scrollIntoView({ block: 'nearest', inline: 'center' });
    };

    scrollSelectedTabIntoView();

    const observer = new MutationObserver(scrollSelectedTabIntoView);
    observer.observe(tab, { attributeFilter: ['data-selected'], attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [layout]);

  return (
    <StyledTab
      ref={tabRef}
      $layout={layout}
      aria-posinset={positionInSet}
      aria-setsize={setSize}
      {...props}
    >
      <TabLabel>
        {children}
        {positionInSet && setSize ? (
          <HiddenText>{`, ${setSize}개 중 ${positionInSet}번째`}</HiddenText>
        ) : null}
      </TabLabel>
      <ActiveIndicator />
    </StyledTab>
  );
};

const TabsPanels = ({ children, ...props }: TabsPanelsProps): ReactElement => {
  return <StyledTabPanels {...props}>{children}</StyledTabPanels>;
};

const TabsPanel = ({ children, keepMounted = false, ...props }: TabsPanelProps): ReactElement => {
  return (
    <StyledTabPanel shouldForceMount={keepMounted} {...props}>
      {children}
    </StyledTabPanel>
  );
};

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panels: TabsPanels,
  Panel: TabsPanel,
}) satisfies TabsComponent;

const addTabSetMetadata = (children: ReactNode): ReactNode => {
  const setSize = countTabChildren(children);
  let position = 0;

  const addMetadata = (node: ReactNode): ReactNode =>
    Children.map(node, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      if (child.type === Fragment) {
        return cloneElement(
          child as ReactElement<{ children?: ReactNode }>,
          undefined,
          addMetadata((child.props as { children?: ReactNode }).children),
        );
      }

      if (child.type !== TabsTab) {
        return child;
      }

      position += 1;

      return cloneElement(child as ReactElement<TabsTabProps>, {
        'aria-posinset': position,
        'aria-setsize': setSize,
      });
    });

  return addMetadata(children);
};

const countTabChildren = (children: ReactNode): number =>
  Children.toArray(children).reduce<number>((count, child) => {
    if (!isValidElement(child)) {
      return count;
    }

    if (child.type === Fragment) {
      return count + countTabChildren((child.props as { children?: ReactNode }).children);
    }

    return child.type === TabsTab ? count + 1 : count;
  }, 0);

const StyledTabs = styled(AriaTabs)<{ $fullWidth: boolean; $layout: TabsLayout }>(
  ({ $fullWidth }) => ({
    display: 'grid',
    width: $fullWidth ? '100%' : 'fit-content',
    maxWidth: '100%',
    minWidth: 0,
  }),
);

const StyledTabList = styled(AriaTabList)<{ $layout: TabsLayout }>(({ $layout, theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: $layout === 'equal' ? 'center' : 'flex-start',
  width: $layout === 'hug' ? 'fit-content' : '100%',
  maxWidth: '100%',
  minWidth: 0,
  gap: theme.spacing.s,
  overflowX: $layout === 'scrollable' ? 'auto' : 'visible',
  overflowY: 'hidden',
  padding: `${theme.spacing['4xl']} ${theme.spacing['2xl']} ${theme.spacing.none}`,
  borderBottom: `1px solid ${theme.color.border.subtle}`,
  listStyle: 'none',
  scrollbarWidth: 'none',
  WebkitOverflowScrolling: 'touch',

  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const StyledTab = styled(AriaTab)<{ $layout: TabsLayout }>(({ $layout, theme }) => {
  const inactiveTypography = theme.typography['body-l-m'];

  return {
    position: 'relative',
    display: 'inline-flex',
    flex: $layout === 'equal' ? '1 1 0' : '0 0 auto',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: $layout === 'equal' ? 0 : theme.pxToRem(TAB_MIN_WIDTH),
    minHeight: theme.pxToRem(36),
    padding: `${theme.spacing.none} ${theme.spacing.none} ${theme.pxToRem(2)}`,
    border: 0,
    outline: 0,
    color: theme.color.text.tertiary,
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: inactiveTypography.fontFamily,
    fontSize: inactiveTypography.fontSize,
    fontWeight: inactiveTypography.fontWeight,
    letterSpacing: inactiveTypography.letterSpacing,
    lineHeight: inactiveTypography.lineHeight,
    textAlign: 'center',
    touchAction: 'manipulation',
    transition: 'color 120ms ease-out',
    WebkitTapHighlightColor: 'transparent',

    '&[data-selected]': {
      cursor: 'default',
    },

    '&[data-disabled]': {
      color: theme.color.text.disabled,
      cursor: 'not-allowed',
      opacity: 0.48,
    },

    '&[data-focus-visible]': {
      outline: `2px solid ${theme.color.border.focused}`,
      outlineOffset: theme.spacing.xs,
    },

    '@media (hover: hover)': {
      '&:hover:not([data-disabled]):not([data-selected])': {
        color: theme.color.text.secondary,
      },
    },

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  };
});

const TabLabel = styled.span(({ theme }) => {
  const inactiveTypography = theme.typography['body-l-m'];
  const activeTypography = theme.typography['body-l-b'];

  return {
    minWidth: 0,
    width: '100%',
    color: 'currentColor',
    fontFamily: inactiveTypography.fontFamily,
    fontSize: inactiveTypography.fontSize,
    fontWeight: inactiveTypography.fontWeight,
    letterSpacing: inactiveTypography.letterSpacing,
    lineHeight: inactiveTypography.lineHeight,
    overflowWrap: 'anywhere',
    textAlign: 'center',
    transition: 'font-weight 120ms ease-out',
    wordBreak: 'keep-all',

    '[data-selected] > &': {
      color: theme.color.text.primary,
      fontFamily: activeTypography.fontFamily,
      fontWeight: activeTypography.fontWeight,
    },

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  };
});

const ActiveIndicator = styled(SelectionIndicator)(({ theme }) => ({
  position: 'absolute',
  bottom: '-1px',
  left: 0,
  width: '100%',
  height: theme.pxToRem(2),
  backgroundColor: theme.color.border.primary,
  pointerEvents: 'none',
  transition:
    'translate 180ms cubic-bezier(0.2, 0, 0, 1), width 180ms cubic-bezier(0.2, 0, 0, 1)',

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));

const StyledTabPanels = styled(AriaTabPanels)`
  width: 100%;
  min-width: 0;
`;

const StyledTabPanel = styled(AriaTabPanel)(({ theme }) => ({
  minWidth: 0,

  '&[data-inert="true"]': {
    display: 'none',
  },

  '&[data-focus-visible]': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));
