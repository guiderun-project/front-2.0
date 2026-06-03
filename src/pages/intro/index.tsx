import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const IntroPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="인트로"
        description="서비스 진입 전 안내와 시작 흐름을 구성할 페이지입니다."
      />
    </PageLayout>
  );
};
