import type { ComponentPropsWithoutRef, ReactElement } from "react";

import styled from "@emotion/styled";

import { IconButton } from "@/components/Icon";
import { Text } from "@/components/Text";

const BLOCK_SIZE = 5;
const ITEM_SIZE = 32;
const CHEVRON_ICON_SIZE = 20;
const DEFAULT_NAV_LABEL = "페이지네이션";

export type PaginationProps = {
  /** Currently active page (1-indexed). */
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
} & Omit<ComponentPropsWithoutRef<"nav">, "onChange" | "children">;

const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
  const blockStart =
    Math.floor((currentPage - 1) / BLOCK_SIZE) * BLOCK_SIZE + 1;
  const blockEnd = Math.min(blockStart + BLOCK_SIZE - 1, totalPages);

  const pages: number[] = [];
  for (let page = blockStart; page <= blockEnd; page += 1) {
    pages.push(page);
  }
  return pages;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onChange,
  "aria-label": ariaLabel = DEFAULT_NAV_LABEL,
  ...props
}: PaginationProps): ReactElement | null => {
  if (totalPages < 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onChange(page);
  };

  return (
    <Nav aria-label={ariaLabel} {...props}>
      <List>
        <li>
          <IconButton
            aria-label="이전 페이지"
            color="icon.secondary"
            disabled={isFirstPage}
            icon="chevron-left-lined"
            iconSize={CHEVRON_ICON_SIZE}
            onClick={() => goTo(currentPage - 1)}
            size={ITEM_SIZE}
          />
        </li>

        {visiblePages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <li key={page}>
              <PageButton
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`${page} 페이지`}
                data-current={isCurrent}
                onClick={() => goTo(page)}
                type="button"
              >
                <Text
                  color={isCurrent ? "text.inverse" : "text.secondary"}
                  font={isCurrent ? "body-s-sb" : "body-s-m"}
                >
                  {page}
                </Text>
              </PageButton>
            </li>
          );
        })}

        <li>
          <IconButton
            aria-label="다음 페이지"
            color="icon.secondary"
            disabled={isLastPage}
            icon="chevron-right-lined"
            iconSize={CHEVRON_ICON_SIZE}
            onClick={() => goTo(currentPage + 1)}
            size={ITEM_SIZE}
          />
        </li>
      </List>
    </Nav>
  );
};

const Nav = styled.nav`
  display: inline-flex;
`;

const List = styled.ul`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;

  & > li {
    display: inline-flex;
  }
`;

const baseButton = `
  display: inline-grid;
  place-items: center;
  appearance: none;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  touch-action: manipulation;
`;

const PageButton = styled.button`
  ${baseButton}
  width: ${({ theme }) => theme.pxToRem(ITEM_SIZE)};
  height: ${({ theme }) => theme.pxToRem(ITEM_SIZE)};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background-color 120ms ease;

  @media (hover: hover) {
    &:hover:not([data-current="true"]) {
      background-color: ${({ theme }) => theme.color.bg.weak};
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  &[data-current="true"] {
    background-color: ${({ theme }) => theme.color.bg.brand};
    cursor: default;
  }
`;
