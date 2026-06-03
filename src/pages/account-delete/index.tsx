import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const AccountDeletePage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="회원 탈퇴"
        description="회원 탈퇴 전 안내와 최종 탈퇴 확인을 제공할 페이지입니다."
      />
    </PageLayout>
  );
};
