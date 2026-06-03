import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const EventNewPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="이벤트 생성"
        description="새 이벤트 정보를 입력하고 등록하는 페이지입니다."
      />
    </PageLayout>
  );
};
