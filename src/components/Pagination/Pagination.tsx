import type { ComponentPropsWithoutRef, ReactElement } from "react";

import styled from "@emotion/styled";

import { HiddenText } from "@/components/HiddenText";
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
          <PagerIconButton
            aria-disabled={isFirstPage}
            aria-label="이전 페이지"
            color={isFirstPage ? "icon.disabled" : "icon.secondary"}
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
          <PagerIconButton
            aria-disabled={isLastPage}
            aria-label="다음 페이지"
            color={isLastPage ? "icon.disabled" : "icon.secondary"}
            icon="chevron-right-lined"
            iconSize={CHEVRON_ICON_SIZE}
            onClick={() => goTo(currentPage + 1)}
            size={ITEM_SIZE}
          />
        </li>
      </List>
      {/* 페이지 이동 결과와 전체 페이지 맥락을 스크린리더에 안내한다.
          블록 윈도잉 때문에 화면만으로는 전체 페이지 수를 알 수 없다. */}
      <HiddenText role="status">
        {`총 ${totalPages}페이지 중 ${currentPage}페이지`}
      </HiddenText>
    </Nav>
  );
};

const Nav = styled.nav`
  display: inline-flex;
`;

/**
 * 경계 페이지에서 native disabled 를 쓰면 브라우저가 포커스를 body 로
 * 떨어뜨려 키보드/스크린리더 사용자가 위치를 잃는다. aria-disabled 로
 * 포커스를 보존하되(경계 밖 클릭은 goTo 가드가 무시), IconButton 의
 * :disabled 시각 상태를 aria-disabled 셀렉터로 동일하게 재현한다.
 * IconButton 기본 스타일보다 늦게 삽입되지 않으므로 && 로 우선순위를 높인다.
 */
const PagerIconButton = styled(IconButton)`
  &&[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.48;
  }

  @media (hover: hover) {
    &&[aria-disabled="true"]:hover {
      background-color: transparent;
      opacity: 0.48;
    }
  }

  &&[aria-disabled="true"]:active {
    background-color: transparent;
    opacity: 0.48;
    transform: none;
  }
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
      background-color: ${({ theme }) => theme.color.bg.overlay};
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  &[data-current="true"] {
    background-color: ${({ theme }) => theme.color.bg['brand-primary']};
    cursor: default;
  }
`;
