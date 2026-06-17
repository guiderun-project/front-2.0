import type { ReactElement } from 'react';

import { PageLayout } from '@/components/PageLayout';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

export const KakaoOAuthPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder
        title="카카오 로그인"
        description="카카오 OAuth 로그인 결과를 처리하고 다음 화면으로 연결할 페이지입니다."
      />
    </PageLayout>
  );
};
