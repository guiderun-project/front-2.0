import type { ReactElement } from "react";

import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import { ANALYTICS_EVENT, trackEvent } from "@/api/core";
import type { EventListGetResponse } from "@/api/types";
import { Icon, Text } from "@/components";
import { APP_PATH } from "@/router/path";

import { getEventTypeBadgeConfig } from "../utils/eventBadge";
import { RecruitStatusBadge } from "./EventBadges";

type EventListItem = EventListGetResponse["items"][number];

type EventListCardProps = {
  event: EventListItem;
  source: "browse" | "search";
};

export const EventListCard = ({
  event,
  source,
}: EventListCardProps): ReactElement => {
  const typeLabel = getEventTypeBadgeConfig(event.type).label;

  const handleClick = () => {
    trackEvent(ANALYTICS_EVENT.EVENT_LIST_CARD_CLICKED, {
      eventId: event.id,
      eventType: event.type,
      recruitStatus: event.recruitStatus,
      source,
    });
  };

  return (
    <CardItem>
      <CardLink to={APP_PATH.EVENT_DETAIL(event.id)} onClick={handleClick}>
        <CardBody>
          <RecruitStatusBadge recruitStatus={event.recruitStatus} size="s" />
          <CardName color="text.primary" font="body-l-sb">
            {event.name}
          </CardName>
          <Text color="text.tertiary" font="detail-m-r">
            {typeLabel} · {event.dateText}
          </Text>
        </CardBody>
        <Icon
          aria-hidden={true}
          color="icon.tertiary"
          icon="chevron-right-lined"
          size={20}
        />
      </CardLink>
    </CardItem>
  );
};

const CardItem = styled.li(({ theme }) => ({
  listStyle: "none",

  "&:not(:last-of-type)": {
    borderBottom: `1px solid ${theme.color.border.subtle}`,
  },
}));

const CardLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  padding: `${theme.spacing.xl} 0`,
  textDecoration: "none",

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const CardBody = styled.div(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing.s,
  minWidth: 0,
}));

const CardName = styled(Text)({
  display: "block",
  width: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});
