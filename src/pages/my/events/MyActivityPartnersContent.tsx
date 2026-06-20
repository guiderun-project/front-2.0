import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { MY_ACTIVITY_PARTNER_SORTS } from '@/api/constants/user';
import type {
  MyActivityPartnerSort,
  MyActivityPartnersResponse,
} from '@/api/types';
import {
  Filter,
  Icon,
  Pagination,
  QueryBoundary,
  RunnerTypeAvatar,
  Text,
  type SelectOptions,
} from '@/components';
import { APP_PATH } from '@/router/path';

import { useMyActivityPartners } from './useMyActivityPartners';

const LOADING_MESSAGE = '함께 달린 파트너를 불러오는 중이에요.';
const ERROR_MESSAGE = '함께 달린 파트너를 불러오지 못했어요.';
const PARTNER_EVENT_DISPLAY_LIMIT = 5;
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const PARTNER_SORT_OPTIONS = [
  { label: '최근순', value: MY_ACTIVITY_PARTNER_SORTS.RECENT },
  { label: '과거순', value: MY_ACTIVITY_PARTNER_SORTS.OLD },
] as const satisfies SelectOptions<MyActivityPartnerSort>;

type MyActivityPartner = MyActivityPartnersResponse['items'][number];
type MyActivityPartnerEvent = MyActivityPartner['events'][number];

const formatActivityEventDate = (date: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  const weekday = WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];

  return `${year}. ${String(month).padStart(2, '0')}. ${String(day).padStart(2, '0')} ${weekday}`;
};

type MyActivityPartnersContentProps = {
  page: number;
  sort: MyActivityPartnerSort;
  onPageChange: (page: number) => void;
  onSortChange: (sort: MyActivityPartnerSort) => void;
};

export const MyActivityPartnersContent = ({
  onPageChange,
  onSortChange,
  page,
  sort,
}: MyActivityPartnersContentProps): ReactElement => {
  return (
    <Section>
      <SectionHeader>
        <Text as="h2" color="text.primary" font="heading-s-m">
          함께 달린 파트너
        </Text>
        <Filter
          ariaLabel="함께 달린 파트너 정렬"
          icon="sort-lined"
          mode="cycle"
          options={PARTNER_SORT_OPTIONS}
          value={sort}
          onChange={onSortChange}
        />
      </SectionHeader>

      <QueryBoundary errorMessage={ERROR_MESSAGE} loadingMessage={LOADING_MESSAGE}>
        <MyActivityPartnersResult
          page={page}
          sort={sort}
          onPageChange={onPageChange}
        />
      </QueryBoundary>
    </Section>
  );
};

type MyActivityPartnersResultProps = {
  page: number;
  sort: MyActivityPartnerSort;
  onPageChange: (page: number) => void;
};

const MyActivityPartnersResult = ({
  onPageChange,
  page,
  sort,
}: MyActivityPartnersResultProps): ReactElement => {
  const { data } = useMyActivityPartners({ sort, page });

  if (data.pagination.totalCount === 0) {
    return <EmptyPartners />;
  }

  return (
    <ResultBody>
      <PartnerList>
        {data.items.map((partner) => (
          <PartnerItem key={partner.partnerId} partner={partner} />
        ))}
      </PartnerList>
      <PaginationWrap>
        <Pagination
          currentPage={page}
          totalPages={data.pagination.totalPages}
          onChange={onPageChange}
        />
      </PaginationWrap>
    </ResultBody>
  );
};

type PartnerItemProps = {
  partner: MyActivityPartner;
};

const PartnerItem = ({ partner }: PartnerItemProps): ReactElement => {
  const visibleEvents = partner.events.slice(0, PARTNER_EVENT_DISPLAY_LIMIT);
  const eventCountText =
    partner.eventCount > PARTNER_EVENT_DISPLAY_LIMIT
      ? `총 ${PARTNER_EVENT_DISPLAY_LIMIT}회 이상`
      : `총 ${partner.eventCount}회`;

  return (
    <PartnerListItem>
      <PartnerHeader>
        <PartnerIdentity>
          <RunnerTypeAvatar size="m" type={partner.type} />
          <PartnerName color="text.primary" font="body-m-sb">
            {partner.name}
          </PartnerName>
        </PartnerIdentity>
        <PartnerCount color="text.secondary" font="body-s-m">
          {eventCountText}
        </PartnerCount>
      </PartnerHeader>

      <PartnerTimeline>
        <TimelineRail aria-hidden={true}>
          <TimelineLine />
        </TimelineRail>
        <EventList aria-label={`${partner.name}님과 함께 달린 이벤트`}>
          {visibleEvents.map((event) => (
            <PartnerEventItem event={event} key={event.id} />
          ))}
        </EventList>
      </PartnerTimeline>
    </PartnerListItem>
  );
};

type PartnerEventItemProps = {
  event: MyActivityPartnerEvent;
};

const PartnerEventItem = ({ event }: PartnerEventItemProps): ReactElement => {
  const eventDate = formatActivityEventDate(event.date);

  return (
    <EventListItem>
      <EventCard
        aria-label={`${event.name}, ${eventDate}`}
        to={APP_PATH.EVENT_DETAIL(event.id)}
      >
        <EventName color="text.primary" font="body-s-m">
          {event.name}
        </EventName>
        <EventDate color="text.secondary" font="body-s-r">
          {eventDate}
        </EventDate>
      </EventCard>
    </EventListItem>
  );
};

const EmptyPartners = (): ReactElement => (
  <EmptyState role="status">
    <Icon
      aria-hidden={true}
      color="icon.tertiary"
      icon="alert-circle-filled"
      size={64}
    />
    <Text align="center" as="p" color="text.tertiary" font="heading-s-m">
      아직 함께 달린 파트너가
      <br />
      없어요
    </Text>
  </EmptyState>
);

const Section = styled.section({
  display: 'flex',
  flexDirection: 'column',
});

const SectionHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing.xl,
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']} ${theme.spacing.none}`,

  '& > h2': {
    flex: '1 1 auto',
    minWidth: 0,
  },
}));

const ResultBody = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xl,
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']}`,
}));

const PartnerList = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xl,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const PartnerListItem = styled.li(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
}));

const PartnerHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
  padding: `${theme.spacing.s} ${theme.spacing.none} ${theme.spacing.s} ${theme.spacing.s}`,
  borderRadius: theme.radius.full,
}));

const PartnerIdentity = styled.span(({ theme }) => ({
  display: 'inline-flex',
  flex: '0 1 auto',
  alignItems: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const PartnerName = styled(Text)({
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const PartnerCount = styled(Text)({
  flex: '1 0 auto',
  textAlign: 'right',
});

const PartnerTimeline = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  gap: theme.spacing.sm,
  width: '100%',
}));

const TimelineRail = styled.span(({ theme }) => ({
  display: 'flex',
  flex: `0 0 ${theme.pxToRem(30)}`,
  justifyContent: 'center',
}));

const TimelineLine = styled.span(({ theme }) => ({
  width: theme.pxToRem(5),
  minHeight: '100%',
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.overlay,
}));

const EventList = styled.ul(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  gap: theme.spacing.md,
  minWidth: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const EventListItem = styled.li({
  minWidth: 0,
});

const EventCard = styled(Link)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: theme.spacing.s,
  width: '100%',
  boxSizing: 'border-box',
  minHeight: theme.pxToRem(70),
  padding: theme.spacing.lg,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.color.bg.elevated,
  textDecoration: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const EventName = styled(Text)({
  display: 'block',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const EventDate = styled(Text)({
  display: 'block',
});

const PaginationWrap = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing.lg,
}));

const EmptyState = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing['2xl'],
  minHeight: theme.pxToRem(515),
  boxSizing: 'border-box',
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.pxToRem(150)}`,
}));
