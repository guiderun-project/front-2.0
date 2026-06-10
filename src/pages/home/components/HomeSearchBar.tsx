import type { ReactElement } from "react";

import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import { Icon, Text } from "@/components";
import { APP_PATH } from "@/router/path";

const SEARCH_PLACEHOLDER = "관심있는 모임을 찾아보세요";

/**
 * 메인 상단 검색 진입 바.
 * 입력 필드가 아니라, 탭하면 이벤트 검색 페이지로 이동하는 진입점이다.
 */
export const HomeSearchBar = (): ReactElement => {
  return (
    <SearchLink to={APP_PATH.EVENT_SEARCH}>
      <Icon
        aria-hidden={true}
        color="icon.secondary"
        icon="search-lined"
        size={20}
      />
      <Placeholder color="text.tertiary" font="body-m-m">
        {SEARCH_PLACEHOLDER}
      </Placeholder>
    </SearchLink>
  );
};

const SearchLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  width: "100%",
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.elevated,
  boxSizing: "border-box",
  textDecoration: "none",

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const Placeholder = styled(Text)({
  flex: "1 1 auto",
  minWidth: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});
