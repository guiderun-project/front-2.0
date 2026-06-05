import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const MyPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="마이페이지 메인"
        description="내 정보와 개인 활동으로 진입하는 마이페이지 홈입니다."
      />
    </PageLayout>
  );
};
