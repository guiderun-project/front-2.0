import type { ReactElement } from 'react';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import type { MatchingWaitingParticipant } from '@/api/types';
import { IconButton, Text } from '@/components';

type MatchSelectionBarProps = {
  canCreateMatching: boolean;
  isCreatingMatching: boolean;
  selectedGuides: MatchingWaitingParticipant[];
  selectedVi: MatchingWaitingParticipant | null;
  onClear: () => void;
  onCreateMatching: () => void;
};

export const MatchSelectionBar = ({
  canCreateMatching,
  isCreatingMatching,
  selectedGuides,
  selectedVi,
  onClear,
  onCreateMatching,
}: MatchSelectionBarProps): ReactElement | null => {
  const hasSelection = selectedVi !== null || selectedGuides.length > 0;

  if (!hasSelection) {
    return null;
  }

  const actionText = canCreateMatching ? '이대로 매칭하기' : '파트너를 선택해주세요';
  const isActionDisabled = !canCreateMatching || isCreatingMatching;

  return (
    <FixedSelectionArea>
      <SelectionPanel aria-label="선택된 매칭 참가자">
        <SelectionContent>
          <SelectionItems>
            <SelectionItem
              isPlaceholder={selectedVi === null}
              label="시각장애러너"
              name={selectedVi?.name ?? '선택전'}
            />
            {selectedGuides.length > 0 ? (
              selectedGuides.map((guide) => (
                <SelectionItem
                  key={guide.userId}
                  isPlaceholder={false}
                  label="가이드러너"
                  name={guide.name}
                />
              ))
            ) : (
              <SelectionItem
                isPlaceholder={true}
                label="가이드러너"
                name="선택전"
              />
            )}
          </SelectionItems>
          <SelectionClearButton
            aria-label="선택한 참가자 모두 해제"
            color="badge.text.primitive"
            icon="delete-lined"
            iconSize={19.2}
            shape="round"
            size={32}
            onClick={onClear}
          />
        </SelectionContent>
        <SelectionActionButton
          disabled={isActionDisabled}
          type="button"
          onClick={onCreateMatching}
        >
          {actionText}
        </SelectionActionButton>
      </SelectionPanel>
    </FixedSelectionArea>
  );
};

type SelectionItemProps = {
  isPlaceholder: boolean;
  label: string;
  name: string;
};

const SelectionItem = ({
  isPlaceholder,
  label,
  name,
}: SelectionItemProps): ReactElement => {
  return (
    <SelectionItemRoot>
      <SelectionLabel font="detail-s-sb">{label}</SelectionLabel>
      <SelectionName $isPlaceholder={isPlaceholder} font="body-m-sb">
        {name}
      </SelectionName>
    </SelectionItemRoot>
  );
};

const selectionBarEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FixedSelectionArea = styled.div(({ theme }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.footer,
  bottom: 0,
  left: '50%',
  width: `min(100%, ${theme.layout.mobileViewportMaxWidth})`,
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} calc(${theme.spacing['2xl']} + env(safe-area-inset-bottom))`,
  boxSizing: 'border-box',
  pointerEvents: 'none',
  transform: 'translateX(-50%)',
}));

const SelectionPanel = styled.aside(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  width: '100%',
  padding: theme.spacing.xl,
  border: `1px solid ${theme.colorPrimitive.neutral['800-a10']}`,
  borderRadius: theme.radius.lg,
  // This Figma component intentionally uses primitive colors instead of semantic surface tokens.
  backgroundImage: `linear-gradient(174.35deg, ${theme.colorPrimitive.neutral['850']} 8%, ${theme.colorPrimitive.cyan['950']} 66%, ${theme.colorPrimitive.cyan['600']} 124%)`,
  boxShadow: `0 0 16px 0 ${theme.colorPrimitive.neutral['800-a10']}`,
  boxSizing: 'border-box',
  pointerEvents: 'auto',
  animation: `${selectionBarEnter} 180ms ease-out both`,

  "html[data-color-mode='dark'] &": {
    borderColor: theme.colorPrimitive.neutral['0-a8'],
    // Figma uses this gradient stop as a literal color in the dark selection bar.
    backgroundImage: `linear-gradient(-4.79deg, ${theme.colorPrimitive.cyan['950']} 74.4%, rgb(14, 113, 181) 154.31%)`,
    boxShadow: `0 0 16px 0 ${theme.colorPrimitive.neutral['950']}`,
  },

  '@media (prefers-color-scheme: dark)': {
    "html:not([data-color-mode='light']) &": {
      borderColor: theme.colorPrimitive.neutral['0-a8'],
      // Figma uses this gradient stop as a literal color in the dark selection bar.
      backgroundImage: `linear-gradient(-4.79deg, ${theme.colorPrimitive.cyan['950']} 74.4%, rgb(14, 113, 181) 154.31%)`,
      boxShadow: `0 0 16px 0 ${theme.colorPrimitive.neutral['950']}`,
    },
  },

  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
}));

const SelectionContent = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing.md,
  width: '100%',
  minWidth: 0,
}));

const SelectionItems = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `${theme.spacing.md} ${theme.spacing['2xl']}`,
  minWidth: 0,
}));

const SelectionItemRoot = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

const SelectionLabel = styled(Text)(({ theme }) => ({
  display: 'block',
  color: theme.colorPrimitive.cyan['500'],

  "html[data-color-mode='dark'] &": {
    color: theme.colorPrimitive.cyan['400'],
  },

  '@media (prefers-color-scheme: dark)': {
    "html:not([data-color-mode='light']) &": {
      color: theme.colorPrimitive.cyan['400'],
    },
  },
}));

const SelectionName = styled(Text)<{ $isPlaceholder: boolean }>(
  ({ $isPlaceholder, theme }) => ({
    display: 'block',
    maxWidth: theme.pxToRem(88),
    overflow: 'hidden',
    color: $isPlaceholder
      ? theme.colorPrimitive.neutral['500']
      : theme.colorPrimitive.neutral['0'],
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
);

const SelectionClearButton = styled(IconButton)(({ theme }) => ({
  flex: '0 0 auto',
  // This Figma action bar uses primitive overlay colors independently from semantic color modes.
  backgroundColor: theme.colorPrimitive.neutral['0-a16'],

  '@media (hover: hover)': {
    '&:hover:not(:disabled)': {
      backgroundColor: theme.colorPrimitive.neutral['0-a16'],
      opacity: 0.88,
    },
  },

  '&:active:not(:disabled)': {
    backgroundColor: theme.colorPrimitive.neutral['0-a16'],
    opacity: 0.8,
  },
}));

const SelectionActionButton = styled.button(({ theme }) => {
  const typography = theme.typography['body-m-sb'];

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: theme.pxToRem(42),
    padding: `${theme.spacing.none} ${theme.spacing.xl}`,
    border: 0,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colorPrimitive.cyan['500'],
    color: theme.colorPrimitive.neutral['0'],
    cursor: 'pointer',
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    letterSpacing: typography.letterSpacing,
    lineHeight: typography.lineHeight,
    transition:
      'background-color 160ms ease-out, color 160ms ease-out, opacity 160ms ease-out, transform 120ms ease-out',
    whiteSpace: 'nowrap',

    '&:active:not(:disabled)': {
      transform: 'scale(0.99)',
    },

    '&:focus-visible': {
      outline: `2px solid ${theme.colorPrimitive.cyan['500-a24']}`,
      outlineOffset: theme.spacing.xs,
    },

    '&:disabled': {
      backgroundColor: theme.colorPrimitive.cyan['400-a20'],
      cursor: 'not-allowed',
    },

    "html[data-color-mode='dark'] &": {
      backgroundColor: theme.colorPrimitive.cyan['400'],
      color: theme.colorPrimitive.neutral['950'],

      '&:disabled': {
        backgroundColor: theme.colorPrimitive.cyan['400-a20'],
      },
    },

    '@media (prefers-color-scheme: dark)': {
      "html:not([data-color-mode='light']) &": {
        backgroundColor: theme.colorPrimitive.cyan['400'],
        color: theme.colorPrimitive.neutral['950'],

        '&:disabled': {
          backgroundColor: theme.colorPrimitive.cyan['400-a20'],
        },
      },
    },

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',

      '&:active:not(:disabled)': {
        transform: 'none',
      },
    },
  };
});
