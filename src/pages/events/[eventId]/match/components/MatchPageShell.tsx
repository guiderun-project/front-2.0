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
          // TODO(추가 필요): TopNavigation 우측 '매칭이 처음인가요?' 툴팁 + '?' 도움말 아이콘 버튼.
          // Figma 4234-66494 상단 우측 참고. 현재 TopNavigation.right 는 IconButton 배열만 지원하므로
          // 툴팁 칩까지 붙이려면 컴포넌트 확장 또는 별도 오버레이가 필요. 이번 작업 범위에서 제외됨.
        }}
      >
        {children}
      </FormPageLayout>
    </PageLayout>
  );
};
