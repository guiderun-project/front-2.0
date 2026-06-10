import { Fragment, useId, type ReactElement } from "react";

import styled from "@emotion/styled";

import { Text } from "@/components";

import { useUpcomingEvents } from "../hooks/useUpcomingEvents";
import { HomeSectionMessage } from "./HomeSectionMessage";
import { MemberUpcomingEventCard } from "./MemberUpcomingEventCard";
import { UpcomingEventCard } from "./UpcomingEventCard";

export const UpcomingEventList = (): ReactElement => {
  const headingId = useId();
  const { data } = useUpcomingEvents();

  return (
    <Section aria-labelledby={headingId}>
      <Text id={headingId} as="h2" color="text.primary" font="heading-s-sb">
        다가오는 러닝 모임
      </Text>

      {data.viewerType === "MEMBER" ? (
        data.items.length > 0 ? (
          <MemberList>
            {data.items.map((event) => (
              <MemberUpcomingEventCard event={event} key={event.id} />
            ))}
          </MemberList>
        ) : (
          <HomeSectionMessage>아직 신청한 모임이 없어요.</HomeSectionMessage>
        )
      ) : data.items.length > 0 ? (
        <Panel>
          {data.items.map((event, index) => (
            <Fragment key={event.id}>
              {index > 0 ? <RowDivider aria-hidden={true} /> : null}
              <UpcomingEventCard event={event} />
            </Fragment>
          ))}
        </Panel>
      ) : (
        <HomeSectionMessage>아직 다가오는 모임이 없어요.</HomeSectionMessage>
      )}
    </Section>
  );
};

const Section = styled.section(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
}));

const Panel = styled.ul(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.xl,
  margin: 0,
  padding: theme.spacing.xl,
  listStyle: "none",
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.elevated,
  boxShadow: `0 ${theme.pxToRem(4)} ${theme.pxToRem(12)} ${theme.color.bg.overlay}`,
}));

const RowDivider = styled.li(({ theme }) => ({
  height: theme.pxToRem(1),
  backgroundColor: theme.color.border.subtle,
  listStyle: "none",
}));

const MemberList = styled.ul(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  margin: 0,
  padding: 0,
  listStyle: "none",
}));
