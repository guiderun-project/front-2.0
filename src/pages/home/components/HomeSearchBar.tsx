import { useState, type FormEvent, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { Icon } from '@/components';
import { APP_PATH } from '@/router/path';

const SEARCH_PLACEHOLDER = '관심있는 모임을 찾아보세요';

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
      <Icon
        aria-hidden={true}
        color="icon.secondary"
        icon="search-lined"
        size={20}
      />
      <SearchInput
        aria-label="이벤트 검색"
        enterKeyHint="search"
        placeholder={SEARCH_PLACEHOLDER}
        type="search"
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
        }}
      />
      <VisuallyHiddenSubmit type="submit">검색</VisuallyHiddenSubmit>
    </SearchForm>
  );
};

const SearchForm = styled.form(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  width: '100%',
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.elevated,
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

  '&:focus': {
    outline: 'none',
  },
}));

const VisuallyHiddenSubmit = styled.button({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});
