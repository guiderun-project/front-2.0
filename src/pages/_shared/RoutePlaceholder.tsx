import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components/Text';

// TODO: Remove this scaffold component as each route is replaced with its real page UI.
type RoutePlaceholderProps = {
  description: string;
  /**
   * 로딩/오류 같은 상태 메시지 용도일 때 true.
   * live region(role="status")으로 렌더링되어 로딩→오류/완료처럼 내용이 교체될 때
   * 스크린리더가 변경을 polite로 낭독한다. 시각적 변화는 없다.
   */
  status?: boolean;
  title: string;
};

export const RoutePlaceholder = ({
  description,
  status = false,
  title,
}: RoutePlaceholderProps): ReactElement => {
  return (
    <PlaceholderSection role={status ? 'status' : undefined}>
      <Text as="h1" font="heading-s-sb">
        {title}
      </Text>
      <Text as="p" color="text.tertiary" font="body-s-r">
        {description}
      </Text>
    </PlaceholderSection>
  );
};

const PlaceholderSection = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing['4xl']} ${theme.spacing['2xl']}`};
`;
