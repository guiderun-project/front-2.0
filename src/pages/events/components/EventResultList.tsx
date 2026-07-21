import type { ReactElement } from "react";

import styled from "@emotion/styled";

import type { EventListGetResponse } from "@/api/types";
import { Pagination } from "@/components";

import { EventListCard } from "./EventListCard";

type EventListItem = EventListGetResponse["items"][number];

type EventResultListProps = {
  items: EventListItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const EventResultList = ({
  items,
  onPageChange,
  page,
  totalPages,
}: EventResultListProps): ReactElement => {
  return (
    <>
      {/* list-style 이 제거된 목록은 iOS VoiceOver(WebKit)가 목록 시맨틱을
          지우므로 role="list" 로 개수·경계 안내를 복원한다. */}
      <List aria-label="모임 목록" role="list">
        {items.map((event) => (
          <EventListCard event={event} key={event.id} />
        ))}
      </List>
      <PaginationWrap>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={onPageChange}
        />
      </PaginationWrap>
    </>
  );
};

const List = styled.ul({
  margin: 0,
  padding: 0,
});

const PaginationWrap = styled.div(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  paddingTop: theme.spacing.md,
}));
