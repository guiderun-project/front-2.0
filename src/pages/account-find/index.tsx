import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const AccountFindPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="계정 찾기"
        description="아이디 찾기와 비밀번호 찾기 흐름을 제공할 페이지입니다."
      />
    </PageLayout>
  );
};
