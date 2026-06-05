import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const EventSearchPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="이벤트 검색"
        description="이벤트 조건 검색과 검색 결과를 제공할 페이지입니다."
      />
    </PageLayout>
  );
};
