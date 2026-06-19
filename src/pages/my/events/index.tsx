import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import {
  createSearchParams,
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { PageLayout, TopNavigation } from '@/components';

import { MyRunningTab } from './components/MyRunningTab';

const MY_ACTIVITY_TAB_ITEMS = [
  { key: 'event', label: '나의 러닝' },
  { key: 'partner', label: '함께 달린 파트너' },
] as const;

type MyActivityTab = (typeof MY_ACTIVITY_TAB_ITEMS)[number]['key'];

const resolveTab = (value: string | null): MyActivityTab =>
  value === 'partner' ? 'partner' : 'event';

export const MyEventsPage = (): ReactElement => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedTab = resolveTab(searchParams.get('tab'));

  return (
    <Page background="bg.subtle">
      <TopNavigation
        left={{
          icon: 'chevron-left-lined',
          ariaLabel: '뒤로가기',
          onClick: () => navigate(-1),
        }}
        title="나의 활동"
      />

      <TabNav aria-label="나의 활동">
        {MY_ACTIVITY_TAB_ITEMS.map(({ key, label }) => (
          <TabLink
            key={key}
            aria-current={selectedTab === key ? 'page' : undefined}
            replace
            to={{ search: createSearchParams({ tab: key }).toString() }}
          >
            {label}
          </TabLink>
        ))}
      </TabNav>

      {selectedTab === 'event' ? <MyRunningTab /> : null}
    </Page>
  );
};

const Page = styled(PageLayout)({
  display: 'flex',
  flexDirection: 'column',
});

const TabNav = styled.nav(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.xl,
  padding: theme.spacing['2xl'],
}));

const TabLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: theme.pxToRem(42),
  paddingInline: theme.spacing.xl,
  borderRadius: theme.radius.md,
  color: theme.color.text.tertiary,
  textDecoration: 'none',
  ...theme.typography['body-m-m'],
  transition: 'color 120ms ease, background-color 120ms ease',

  '&[aria-current="page"]': {
    backgroundColor: theme.color.bg.overlay,
    color: theme.color.text.secondary,
    ...theme.typography['body-m-sb'],
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },

  '@media (hover: hover)': {
    '&:hover:not([aria-current="page"])': {
      color: theme.color.text.secondary,
    },
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));
