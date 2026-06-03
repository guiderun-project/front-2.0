import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const MyEventsPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="나의 활동"
        description="나의 이벤트와 함께 달린 파트너 탭을 제공할 페이지입니다."
      />
    </PageLayout>
  );
};
