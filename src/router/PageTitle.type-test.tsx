import type { ReactElement } from 'react';

import { PageTitle } from './PageTitle';
import {
  APP_TITLE,
  ROUTE_PAGE_TITLES,
  formatPageTitle,
} from './pageTitleUtils';

export const APP_TITLE_MATCHES_PRODUCT_NAME: '가이드런프로젝트' = APP_TITLE;

export const BASE_PAGE_TITLE: '가이드런프로젝트' = formatPageTitle();

export const EVENT_SEARCH_PAGE_TITLE: '모임 검색 | 가이드런프로젝트' =
  formatPageTitle('모임 검색');

export const MAIN_ROUTE_PAGE_TITLE: '메인' = ROUTE_PAGE_TITLES.MAIN;

export const MAIN_PAGE_TITLE: '메인 | 가이드런프로젝트' = formatPageTitle(
  ROUTE_PAGE_TITLES.MAIN,
);

export const PAGE_TITLE_COMPONENT_RETURNS_ELEMENT: ReactElement = (
  <PageTitle title="모임 검색" />
);
