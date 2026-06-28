import type { ReactElement } from 'react';

import { formatPageTitle } from './title';

type PageTitleProps = {
  title?: string;
};

export const PageTitle = ({ title }: PageTitleProps): ReactElement => {
  return <title>{formatPageTitle(title)}</title>;
};
