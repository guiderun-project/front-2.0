import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const EventAttendancePage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="출석하기"
        description="이벤트 참가자의 출석 상태를 확인하고 기록할 페이지입니다."
      />
    </PageLayout>
  );
};
