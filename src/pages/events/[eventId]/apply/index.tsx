import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const EventApplyPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="이벤트 신청"
        description="선택한 이벤트에 참가 신청 정보를 제출할 페이지입니다."
      />
    </PageLayout>
  );
};
