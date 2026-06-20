import { useCallback, useRef, type ReactElement } from 'react';

import styled from '@emotion/styled';
import {
  createSearchParams,
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { MY_ACTIVITY_PARTNER_SORTS } from '@/api/constants/user';
import type { MyActivityPartnerSort } from '@/api/types';
import { PageLayout, TopNavigation } from '@/components';

import { MyActivityPartnersContent } from './partners';

const MY_ACTIVITY_TAB_ITEMS = [
  { key: 'solo', label: '나의 러닝' },
  { key: 'together', label: '함께 달린 파트너' },
] as const;

const DEFAULT_PARTNER_PAGE = 1;
const DEFAULT_PARTNER_SORT = MY_ACTIVITY_PARTNER_SORTS.RECENT;

type MyActivityTab = (typeof MY_ACTIVITY_TAB_ITEMS)[number]['key'];

const resolveTab = (value: string | null): MyActivityTab =>
  value === 'together' ? 'together' : 'solo';

const resolvePartnerSort = (value: string | null): MyActivityPartnerSort =>
  value === MY_ACTIVITY_PARTNER_SORTS.OLD
    ? MY_ACTIVITY_PARTNER_SORTS.OLD
    : DEFAULT_PARTNER_SORT;

const resolvePage = (value: string | null): number => {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : DEFAULT_PARTNER_PAGE;
};

export const MyEventsPage = (): ReactElement => {
  const navigate = useNavigate();
  const partnerSectionRef = useRef<HTMLElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = resolveTab(searchParams.get('tab'));
  const partnerSort = resolvePartnerSort(searchParams.get('sort'));
  const partnerPage = resolvePage(searchParams.get('page'));

  const scrollToPartnerSection = useCallback(() => {
    partnerSectionRef.current?.scrollIntoView({
      block: 'start',
      behavior: 'auto',
    });
  }, []);

  const handlePartnerSortChange = useCallback(
    (nextSort: MyActivityPartnerSort) => {
      setSearchParams(
        createSearchParams({
          tab: 'together',
          sort: nextSort,
          page: String(DEFAULT_PARTNER_PAGE),
        }),
        { replace: true },
      );
      window.requestAnimationFrame(scrollToPartnerSection);
    },
    [scrollToPartnerSection, setSearchParams],
  );

  const handlePartnerPageChange = useCallback(
    (nextPage: number) => {
      setSearchParams(
        createSearchParams({
          tab: 'together',
          sort: partnerSort,
          page: String(nextPage),
        }),
        { replace: true },
      );
      window.requestAnimationFrame(scrollToPartnerSection);
    },
    [partnerSort, scrollToPartnerSection, setSearchParams],
  );

  return (
    <PageLayout background="bg.subtle">
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

      {selectedTab === 'together' ? (
        <MyActivityPartnersContent
          page={partnerPage}
          sectionRef={partnerSectionRef}
          sort={partnerSort}
          onPageChange={handlePartnerPageChange}
          onSortChange={handlePartnerSortChange}
        />
      ) : null}
    </PageLayout>
  );
};

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
