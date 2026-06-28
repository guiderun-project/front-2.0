import type { ReactElement } from 'react';

const APP_TITLE = '가이드런프로젝트';

const formatPageTitle = (title?: string): string => {
  return title ? `${title} | ${APP_TITLE}` : APP_TITLE;
};

type PageTitleProps = {
  title?: string;
};

export const PageTitle = ({ title }: PageTitleProps): ReactElement => {
  return <title>{formatPageTitle(title)}</title>;
};
