import type { ReactElement, ReactNode } from 'react';

import { FormPageLayout, PageLayout } from '@/components';

import { useEventMatchRoute } from '../useEventMatchPage';

type MatchPageShellProps = {
  children: ReactNode;
  description?: ReactNode;
  onBack?: () => void;
  title?: ReactNode;
};

const DEFAULT_MATCH_PAGE_TITLE = '매칭하고 싶은 참가자를\n차례대로 선택해주세요';

export const MatchPageShell = ({
  children,
  description,
  onBack,
  title = DEFAULT_MATCH_PAGE_TITLE,
}: MatchPageShellProps): ReactElement => {
  const { navigateBack } = useEventMatchRoute();

  return (
    <PageLayout background="bg.subtle">
      <FormPageLayout
        description={description}
        title={title}
        topNavigation={{
          left: {
            ariaLabel: '이전 페이지로 이동',
            icon: 'chevron-left-lined',
            onClick: onBack ?? navigateBack,
          },
        }}
      >
        {children}
      </FormPageLayout>
    </PageLayout>
  );
};
