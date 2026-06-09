import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Icon, Text } from '@/components';
import { APP_PATH } from '@/router/path';

/**
 * 메인 상단 검색 진입 바.
 * 인라인 검색이 아니라 이벤트 검색 페이지로 이동하는 진입점이다.
 */
export const HomeSearchBar = (): ReactElement => {
  return (
    <SearchBar aria-label="이벤트 검색" to={APP_PATH.EVENT_SEARCH}>
      <Placeholder aria-hidden={true} color="text.tertiary" font="body-m-m">
        이벤트를 검색해보세요
      </Placeholder>
      <SearchAction aria-hidden={true}>
        <Icon color="icon.inverse" icon="search-lined" size={16} />
        <Text color="text.inverse" font="body-s-sb">
          검색
        </Text>
      </SearchAction>
    </SearchBar>
  );
};

const SearchBar = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.md,
  width: '100%',
  padding: `${theme.spacing.s} ${theme.spacing.s} ${theme.spacing.s} ${theme.spacing.lg}`,
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.default,
  boxSizing: 'border-box',
  textDecoration: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const Placeholder = styled(Text)({
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const SearchAction = styled.span(({ theme }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: theme.spacing.xs,
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  borderRadius: theme.radius.full,
  // 디자인의 검은 검색 버튼에 대응하는 solid dark semantic 토큰이 없어
  // 임시로 primitive(neutral.900)를 사용한다. 토큰 정리 시 semantic 토큰으로 교체 예정.
  backgroundColor: theme.colorPrimitive.neutral[900],
}));
