import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const EventSupportPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="이동지원 연락처 조회"
        description="이벤트 이동지원에 필요한 연락처 정보를 조회할 페이지입니다."
      />
    </PageLayout>
  );
};
