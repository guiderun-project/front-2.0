import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const MyEditPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="나의 정보 수정"
        description="내 정보와 러닝 정보를 수정할 페이지입니다."
      />
    </PageLayout>
  );
};
