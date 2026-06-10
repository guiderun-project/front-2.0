import type { ReactNode } from 'react';

import { Text } from '@/components';

type AttendanceLeadDescriptionProps = {
  leadCount: number;
};

export const AttendanceLeadDescription = ({
  leadCount,
}: AttendanceLeadDescriptionProps): ReactNode => {
  return (
    <Text as="span" color="text.tertiary" font="body-m-sb">
      현재{' '}
      <Text as="span" color="text.brand" font="body-m-sb">
        {leadCount}명
      </Text>
      이 출석 대기중이에요
    </Text>
  );
};
