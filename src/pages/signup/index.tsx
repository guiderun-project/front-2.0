import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const SignupPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="회원가입"
        description="신규 회원 가입 정보를 입력하고 가입 절차를 진행할 페이지입니다."
      />
    </PageLayout>
  );
};
