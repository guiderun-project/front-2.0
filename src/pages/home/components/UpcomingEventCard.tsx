import type { ReactElement } from "react";

import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import { Badge, Icon, Text } from "@/components";
import { APP_PATH } from "@/router/path";
import { formatDateSrLabel } from "@/utils";

import {
  formatDday,
  formatDdayLabel,
  formatGuestEventDate,
  getDdayBadgeVariant,
  type UpcomingGuestEvent,
} from "@/pages/home/utils";

type UpcomingEventCardProps = {
  event: UpcomingGuestEvent;
};

export const UpcomingEventCard = ({
  event,
}: UpcomingEventCardProps): ReactElement => {
  const dateText = formatGuestEventDate(event.date);
  // 시각 표기('2026. 07. 21 화')는 스크린리더가 숫자·요일을 끊어 읽어
  // 낭독 라벨만 '2026년 7월 21일 화요일' 형식으로 병기한다.
  const dateSrLabel = formatDateSrLabel(event.date, { withWeekday: true });
  const ariaLabel = `${event.name}, ${formatDdayLabel(event.dDay)}, ${dateSrLabel}`;

  return (
    <RowItem>
      <RowLink aria-label={ariaLabel} to={APP_PATH.EVENT_DETAIL(event.id)}>
        <RowMain>
          <TitleLine>
            <Badge size="s" tone="cyan" variant={getDdayBadgeVariant(event.dDay)}>
              {formatDday(event.dDay)}
            </Badge>
            <RowName color="text.primary" font="body-l-sb">
              {event.name}
            </RowName>
          </TitleLine>
          <Text color="text.secondary" font="detail-m-r">
            {dateText}
          </Text>
        </RowMain>
        <Icon
          aria-hidden={true}
          color="icon.tertiary"
          icon="chevron-right-lined"
          size={20}
        />
      </RowLink>
    </RowItem>
  );
};

const RowItem = styled.li({
  listStyle: "none",
});

const RowLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.xl,
  width: "100%",
  boxSizing: "border-box",
  textDecoration: "none",

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const RowMain = styled.div(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  gap: theme.spacing.md,
  minWidth: 0,
}));

const TitleLine = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  minWidth: 0,
}));

const RowName = styled(Text)({
  display: "block",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});
