import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const EventsPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="전체 이벤트"
        description="예정 이벤트와 지난 이벤트 탭을 제공할 이벤트 목록 페이지입니다."
      />
    </PageLayout>
  );
};
