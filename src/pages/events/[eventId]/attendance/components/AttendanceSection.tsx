import { useId, type ReactElement, type ReactNode } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

type AttendanceSectionProps = {
  children: ReactNode;
  count: number;
  hasDivider?: boolean;
  title: string;
};

export const AttendanceSection = ({
  children,
  count,
  hasDivider = false,
  title,
}: AttendanceSectionProps): ReactElement => {
  const titleId = useId();

  return (
    <SectionContainer $hasDivider={hasDivider} aria-labelledby={titleId}>
      <SectionHeader>
        <Text as="h2" color="text.primary" font="body-l-sb" id={titleId}>
          {title}
        </Text>
        <Text color="text.tertiary" font="body-m-m">
          {count}명
        </Text>
      </SectionHeader>
      {children}
    </SectionContainer>
  );
};

const SectionContainer = styled.section<{ $hasDivider: boolean }>(
  ({ $hasDivider, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: $hasDivider ? theme.spacing['2xl'] : 0,
    borderTop: $hasDivider ? `1px solid ${theme.color.border.subtle}` : 0,
  }),
);

const SectionHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));
