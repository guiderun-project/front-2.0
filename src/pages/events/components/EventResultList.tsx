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
      <List>
        {items.map((event) => (
          <EventListCard event={event} key={event.id} />
        ))}
      </List>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={onPageChange}
      />
    </>
  );
};

const List = styled.ul({
  margin: 0,
  padding: 0,
});
