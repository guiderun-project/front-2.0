import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const EventDetailPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="이벤트 상세"
        description="상세 내용, 신청자 명단, 매칭현황 탭을 제공할 이벤트 상세 페이지입니다."
      />
    </PageLayout>
  );
};
