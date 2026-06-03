import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const EventMatchPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="매칭하기"
        description="이벤트 참가자 매칭을 생성하고 조정할 페이지입니다."
      />
    </PageLayout>
  );
};
