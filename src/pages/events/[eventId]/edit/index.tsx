import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const EventEditPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="이벤트 수정"
        description="기존 이벤트 정보를 수정하고 저장할 페이지입니다."
      />
    </PageLayout>
  );
};
