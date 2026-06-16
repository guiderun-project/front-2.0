import type { ReactElement } from 'react';

import { useNavigate } from 'react-router-dom';

import { FormPageLayout, PageLayout } from '@/components';
import { APP_PATH } from '@/router/path';

export const FindId = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <PageLayout background="bg.default">
      <FormPageLayout
        topNavigation={{
          left: {
            icon: 'chevron-left-lined',
            ariaLabel: '이전 페이지로 이동',
            onClick: () => navigate(-1),
          },
          right: [
            {
              icon: 'close-lined',
              ariaLabel: '닫기',
              onClick: () => navigate(APP_PATH.LOGIN),
            },
          ],
        }}
        title={'아이디를 찾기 위해\n번호 인증이 필요해요'}
      >
        {/* TODO: Step 1~3 구현 */}
        <></>
      </FormPageLayout>
    </PageLayout>
  );
};
