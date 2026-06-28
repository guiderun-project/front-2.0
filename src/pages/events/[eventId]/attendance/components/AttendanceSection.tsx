import { useId, type ReactElement, type ReactNode } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

type AttendanceSectionProps = {
  hasDivider?: boolean;
  children: ReactNode;
  count: number;
  title: string;
};

export const AttendanceSection = ({
  hasDivider = false,
  children,
  count,
  title,
}: AttendanceSectionProps): ReactElement => {
  const titleId = useId();

  return (
    <SectionContainer $hasDivider={hasDivider} aria-labelledby={titleId}>
      <SectionHeader>
        <SectionHeading id={titleId}>
          <SectionHeadingText role="text">
            <Text as="span" color="text.primary" font="body-l-sb">
              {title}
            </Text>{' '}
            <SectionCountText color="text.tertiary" font="body-m-m">
              {count}명
            </SectionCountText>
          </SectionHeadingText>
        </SectionHeading>
      </SectionHeader>
      {children}
    </SectionContainer>
  );
};

const SectionContainer = styled.section<{ $hasDivider: boolean }>(
  ({ $hasDivider, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing['2xl'],
    paddingTop: $hasDivider ? theme.spacing['2xl'] : theme.spacing.lg,
    borderTop: $hasDivider ? `1px solid ${theme.color.border.subtle}` : 0,
  }),
);

const SectionHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const SectionHeading = styled.h2({
  margin: 0,
});

const SectionHeadingText = styled.span({
  display: 'inline',
});

const SectionCountText = styled(Text)(({ theme }) => ({
  marginLeft: theme.spacing.md,
}));
