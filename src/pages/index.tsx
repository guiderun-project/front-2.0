import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const MainPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="메인"
        description="가이드런의 홈 화면과 주요 진입 흐름을 구성할 페이지입니다."
      />
    </PageLayout>
  );
};
