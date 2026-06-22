import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Badge, Icon, RunnerTypeAvatar, Text } from '@/components';
import { APP_PATH } from '@/router/path';

import { formatDday, formatDdayLabel, type UpcomingMemberEvent } from '../utils';

type MemberUpcomingEventCardProps = {
  event: UpcomingMemberEvent;
};

const PARTNER_TYPE_LABEL = { VI: '시각장애러너', GUIDE: '가이드러너' } as const;

export const MemberUpcomingEventCard = ({
  event,
}: MemberUpcomingEventCardProps): ReactElement => {
  const partners = event.myPartner ?? [];
  const isMatched = partners.length > 0;
  const partnerText = isMatched
    ? `파트너 ${partners.map((partner) => `${PARTNER_TYPE_LABEL[partner.type]} ${partner.name}`).join(', ')}`
    : '아직 파트너 매칭 전이에요';
  const ariaLabel = `${event.name}, ${formatDdayLabel(event.dDay)}, ${event.place}, ${event.scheduleText}, ${partnerText}`;

  return (
    <CardItem>
      <CardLink aria-label={ariaLabel} to={APP_PATH.EVENT_DETAIL(event.id)}>
        <TitleRow>
          <Badge size="s" tone="cyan" variant="solid">
            {formatDday(event.dDay)}
          </Badge>
          <CardName color="text.primary" font="body-l-sb">
            {event.name}
          </CardName>
          <Icon
            aria-hidden={true}
            color="icon.tertiary"
            icon="chevron-right-lined"
            size={20}
          />
        </TitleRow>

        <InfoRow>
          <Icon aria-hidden={true} color="icon.secondary" icon="map-lined" size={16} />
          <Text color="text.secondary" font="detail-m-r">
            {event.place}
          </Text>
        </InfoRow>

        <InfoRow>
          <Icon
            aria-hidden={true}
            color="icon.secondary"
            icon="calendar-lined"
            size={16}
          />
          <Text color="text.secondary" font="detail-m-r">
            {event.scheduleText}
          </Text>
        </InfoRow>

        {isMatched ? (
          <MatchedPartnerBox>
            <PartnerLabel color="text.secondary" font="detail-m-m">
              내 파트너
            </PartnerLabel>
            <PartnerChips>
              {partners.map((partner, index) => (
                <PartnerChip key={`${partner.type}-${partner.name}-${index}`}>
                  <RunnerTypeAvatar
                    size="s"
                    type={partner.type}
                  />
                  <Text color="text.primary" font="detail-m-sb">
                    {partner.name}
                  </Text>
                </PartnerChip>
              ))}
            </PartnerChips>
          </MatchedPartnerBox>
        ) : (
          <MatchPendingNotice>
            <Text align="center" as="p" color="text.tertiary" font="detail-m-m">
              아직 파트너 매칭 전이에요.
              <br />
              대략 러닝 2-3일 전에 매칭될 예정이에요.
            </Text>
          </MatchPendingNotice>
        )}
      </CardLink>
    </CardItem>
  );
};

const CardItem = styled.li({
  listStyle: 'none',
});

const CardLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  width: '100%',
  boxSizing: 'border-box',
  padding: theme.spacing.xl,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.color.bg.elevated,
  boxShadow: `0 ${theme.pxToRem(4)} ${theme.pxToRem(12)} ${theme.color.bg.overlay}`,
  textDecoration: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const TitleRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const CardName = styled(Text)({
  flex: '1 1 auto',
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const InfoRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const MatchedPartnerBox = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing['3xl'],
  padding: theme.spacing.lg,
  borderRadius: theme.pxToRem(10),
  backgroundColor: theme.color.bg['brand-soft'],
}));

const PartnerLabel = styled(Text)({
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
});

const PartnerChips = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const PartnerChip = styled.span(({ theme }) => ({
  display: 'inline-flex',
  flex: '0 0 auto',
  alignItems: 'center',
  gap: theme.spacing.s,
}));

const MatchPendingNotice = styled.div(({ theme }) => ({
  padding: theme.spacing.lg,
  borderRadius: theme.pxToRem(10),
  backgroundColor: theme.color.bg.subtle,
}));
