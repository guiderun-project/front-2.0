import {
  useDeferredValue,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";

import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

import {
  EVENT_LIST_TYPE_FILTERS,
  RECRUIT_STATUS_FILTERS,
} from "@/api/constants/common";
import type { EventListTypeFilter, RecruitStatusFilter } from "@/api/types";
import { Icon, PageLayout, QueryBoundary } from "@/components";

import { EventSearchResult } from "../components/EventSearchResult";

const SEARCH_PLACEHOLDER = "관심있는 모임을 찾아보세요";
const LOADING_MESSAGE = "모임을 불러오는 중이에요.";
const ERROR_MESSAGE = "모임을 불러오지 못했어요.";

export const EventSearchPage = (): ReactElement => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword);
  const [typeFilter, setTypeFilter] = useState<EventListTypeFilter>(
    EVENT_LIST_TYPE_FILTERS.TOTAL,
  );
  const [recruitFilter, setRecruitFilter] = useState<RecruitStatusFilter>(
    RECRUIT_STATUS_FILTERS.ALL,
  );
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
    setPage(1);
  };

  const handleTypeChange = (value: EventListTypeFilter) => {
    startTransition(() => {
      setTypeFilter(value);
      setPage(1);
    });
  };

  const handleRecruitChange = (value: RecruitStatusFilter) => {
    startTransition(() => {
      setRecruitFilter(value);
      setPage(1);
    });
  };

  const handlePageChange = (next: number) => {
    startTransition(() => {
      setPage(next);
    });
  };

  return (
    <PageLayout background="bg.default">
      <SearchHeader
        role="search"
        onSubmit={(event: FormEvent) => event.preventDefault()}
      >
        <SearchField>
          <Icon
            aria-hidden={true}
            color="icon.secondary"
            icon="search-lined"
            size={20}
          />
          <SearchInput
            autoFocus
            aria-label="이벤트 검색"
            enterKeyHint="search"
            placeholder={SEARCH_PLACEHOLDER}
            type="search"
            value={keyword}
            onChange={handleKeywordChange}
          />
        </SearchField>
        <CancelButton type="button" onClick={() => navigate(-1)}>
          취소
        </CancelButton>
      </SearchHeader>

      <Body>
        <QueryBoundary errorMessage={ERROR_MESSAGE} loadingMessage={LOADING_MESSAGE}>
          <EventSearchResult
            keyword={deferredKeyword}
            page={page}
            recruitFilter={recruitFilter}
            typeFilter={typeFilter}
            onPageChange={handlePageChange}
            onRecruitChange={handleRecruitChange}
            onTypeChange={handleTypeChange}
          />
        </QueryBoundary>
      </Body>
    </PageLayout>
  );
};

const SearchHeader = styled.form(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  padding: `${theme.spacing.lg} ${theme.spacing["2xl"]}`,
}));

const SearchField = styled.div(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  alignItems: "center",
  gap: theme.spacing.md,
  minWidth: 0,
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.subtle,

  "&:focus-within": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const SearchInput = styled.input(({ theme }) => ({
  flex: "1 1 auto",
  minWidth: 0,
  border: "none",
  padding: 0,
  backgroundColor: "transparent",
  color: theme.color.text.primary,
  ...theme.typography["body-m-m"],

  "&::placeholder": {
    color: theme.color.text.tertiary,
  },

  "&:focus": {
    outline: "none",
  },
}));

const CancelButton = styled.button(({ theme }) => ({
  flexShrink: 0,
  border: 0,
  padding: 0,
  backgroundColor: "transparent",
  color: theme.color.text.secondary,
  cursor: "pointer",
  ...theme.typography["body-m-m"],

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const Body = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
}));
