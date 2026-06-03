import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

type RoutePlaceholderProps = {
  description: string;
  title: string;
};

export const RoutePlaceholder = ({
  description,
  title,
}: RoutePlaceholderProps): ReactElement => {
  return (
    <PlaceholderSection>
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
