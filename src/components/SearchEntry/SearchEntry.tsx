import type { ReactElement } from "react";

import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";

const DEFAULT_PLACEHOLDER = "관심있는 모임을 찾아보세요";

type SearchEntryProps = {
  to: string;
  placeholder?: string;
};

export const SearchEntry = ({
  placeholder = DEFAULT_PLACEHOLDER,
  to,
}: SearchEntryProps): ReactElement => {
  return (
    <SearchLink to={to}>
      <Icon
        aria-hidden={true}
        color="icon.secondary"
        icon="search-lined"
        size={20}
      />
      <Placeholder color="text.tertiary" font="body-m-m">
        {placeholder}
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
