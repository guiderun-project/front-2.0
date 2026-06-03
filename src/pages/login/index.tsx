import type { ReactElement } from 'react';

import { PageLayout } from '@/components';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const LoginPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="아이디 비밀번호 로그인"
        description="아이디와 비밀번호로 로그인하는 인증 페이지입니다."
      />
    </PageLayout>
  );
};
