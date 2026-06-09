import { useState, type FormEvent, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { Icon, Text } from '@/components';
import { APP_PATH } from '@/router/path';

/**
 * 메인 상단 검색 바.
 * 입력한 키워드를 이벤트 검색 페이지로 전달하며 이동한다(빈 값이면 키워드 없이 이동).
 */
export const HomeSearchBar = (): ReactElement => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();
    const search = trimmedKeyword
      ? `?${createSearchParams({ keyword: trimmedKeyword }).toString()}`
      : '';

    navigate(`${APP_PATH.EVENT_SEARCH}${search}`);
  };

  return (
    <SearchForm role="search" onSubmit={handleSubmit}>
      <SearchInput
        aria-label="이벤트 검색"
        enterKeyHint="search"
        placeholder="이벤트를 검색해보세요"
        type="search"
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
        }}
      />
      <SearchSubmit type="submit">
        <Icon
          aria-hidden={true}
          color="icon.inverse"
          icon="search-lined"
          size={16}
        />
        <Text as="span" color="text.inverse" font="body-s-sb">
          검색
        </Text>
      </SearchSubmit>
    </SearchForm>
  );
};

const SearchForm = styled.form(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  width: '100%',
  padding: `${theme.spacing.s} ${theme.spacing.s} ${theme.spacing.s} ${theme.spacing.lg}`,
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.default,
  boxSizing: 'border-box',

  '&:focus-within': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const SearchInput = styled.input(({ theme }) => ({
  flex: '1 1 auto',
  minWidth: 0,
  border: 'none',
  padding: 0,
  backgroundColor: 'transparent',
  color: theme.color.text.primary,
  fontFamily: theme.typography['body-m-m'].fontFamily,
  fontSize: theme.typography['body-m-m'].fontSize,
  fontWeight: theme.typography['body-m-m'].fontWeight,
  letterSpacing: theme.typography['body-m-m'].letterSpacing,
  lineHeight: theme.typography['body-m-m'].lineHeight,

  '&::placeholder': {
    color: theme.color.text.tertiary,
  },

  // 포커스 표시는 폼의 :focus-within으로 통일한다.
  '&:focus': {
    outline: 'none',
  },
}));

const SearchSubmit = styled.button(({ theme }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: theme.spacing.xs,
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  border: 'none',
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.inverse,
  cursor: 'pointer',
  touchAction: 'manipulation',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));
