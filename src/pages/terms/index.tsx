import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const TermsPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="약관 보기"
        description="서비스 이용 약관과 개인정보 관련 내용을 확인할 페이지입니다."
      />
    </PageLayout>
  );
};
