import type { ReactElement } from 'react';

import { useNavigate } from 'react-router-dom';

import { FormPageLayout, PageLayout } from '@/components';
import { APP_PATH } from '@/router/path';

export const FindPassword = (): ReactElement => {
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
        title={'비밀번호 재설정을 위해\n아래 정보를 입력해주세요'}
      >
        {/* TODO: Step 1~3 구현 */}
        <></>
      </FormPageLayout>
    </PageLayout>
  );
};
