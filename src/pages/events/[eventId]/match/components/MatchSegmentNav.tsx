import type { ReactElement, RefObject } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

import type { MatchSectionId } from '../matchPageState';

type MatchSegmentNavProps = {
  activeSection: MatchSectionId;
  navRef?: RefObject<HTMLDivElement | null>;
  onSelect: (sectionId: MatchSectionId) => void;
};

const SEGMENTS: Array<{ id: MatchSectionId; label: string }> = [
  { id: 'waiting', label: '매칭대기' },
  { id: 'completed', label: '매칭완료' },
];

export const MatchSegmentNav = ({
  activeSection,
  navRef,
  onSelect,
}: MatchSegmentNavProps): ReactElement => {
  return (
    <SegmentBar ref={navRef} as="nav" aria-label="매칭 섹션 이동">
      {SEGMENTS.map((segment) => {
        const isActive = activeSection === segment.id;

        return (
          <SegmentButton
            key={segment.id}
            aria-current={isActive ? 'true' : undefined}
            type="button"
            $isActive={isActive}
            onClick={() => {
              onSelect(segment.id);
            }}
          >
            <Text
              as="span"
              color={isActive ? 'text.secondary' : 'text.tertiary'}
              font={isActive ? 'body-m-sb' : 'body-m-m'}
            >
              {segment.label}
            </Text>
          </SegmentButton>
        );
      })}
    </SegmentBar>
  );
};

const SegmentBar = styled.div(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.control,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.none,
  padding: theme.spacing['2xl'],
  backgroundColor: theme.color.bg.default,
}));

const SegmentButton = styled.button<{ $isActive: boolean }>(
  ({ $isActive, theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: theme.pxToRem(42),
    padding: `${theme.spacing.none} ${theme.spacing.lg}`,
    border: 0,
    borderRadius: theme.radius.md,
    backgroundColor: $isActive ? theme.color.bg.overlay : 'transparent',
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    transition: 'background-color 160ms ease-out',

    '&:focus-visible': {
      outline: `2px solid ${theme.color.border.focused}`,
      outlineOffset: `-${theme.spacing.xs}`,
    },

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  }),
);
