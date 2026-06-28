import { Fragment, useId, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MatchingWaitingParticipant } from '@/api/types';
import { HiddenText, Icon, Text } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

type ParticipantAdditionalInfoAccordionProps = {
  participant: MatchingWaitingParticipant;
};

type AdditionalInfoItem = {
  answer: string;
  title: string;
};

const getAdditionalInfoItems = (
  participant: MatchingWaitingParticipant,
): AdditionalInfoItem[] => {
  const commentItems = participant.additionalComment
    ? [
        {
          answer: participant.additionalComment,
          title: '추가 코멘트',
        },
      ]
    : [];
  const answerItems = participant.additionalAnswers
    .filter((answer) => answer.answer)
    .map((answer) => ({
      answer: answer.answer ?? '',
      title: answer.questionTitle,
    }));

  return [...commentItems, ...answerItems];
};

export const ParticipantAdditionalInfoAccordion = ({
  participant,
}: ParticipantAdditionalInfoAccordionProps): ReactElement | null => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const items = getAdditionalInfoItems(participant);
  const buttonDescription =
    `${RUNNER_TYPE_LABELS[participant.type]} ${participant.name} 추가 정보`;

  if (items.length === 0) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  return (
    <AccordionRoot>
      <AccordionHeaderButton
        aria-controls={panelId}
        aria-expanded={isOpen}
        type="button"
        onClick={handleToggle}
      >
        <HiddenText>{buttonDescription}</HiddenText>
        <Text aria-hidden={true} color="text.primary" font="detail-m-m">
          추가 정보
        </Text>
        <ChevronIcon $isOpen={isOpen}>
          <Icon
            aria-hidden={true}
            color="icon.secondary"
            icon="chevron-down-lined"
            size={20}
          />
        </ChevronIcon>
      </AccordionHeaderButton>
      <AccordionPanel
        aria-hidden={!isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        id={panelId}
        inert={!isOpen ? true : undefined}
      >
        <AccordionPanelInner $isOpen={isOpen}>
          {items.map((item, index) => (
            <Fragment key={`${item.title}-${index}`}>
              {index > 0 ? <InfoDivider /> : null}
              <InfoItem>
                <Text color="text.quaternary" font="detail-s-sb">
                  {item.title}
                </Text>
                <Text color="text.secondary" font="detail-m-m">
                  {item.answer}
                </Text>
              </InfoItem>
            </Fragment>
          ))}
        </AccordionPanelInner>
      </AccordionPanel>
    </AccordionRoot>
  );
};

const AccordionRoot = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.elevated,
}));

const AccordionHeaderButton = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.md,
  width: '100%',
  minHeight: theme.pxToRem(44),
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  touchAction: 'manipulation',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: `-${theme.spacing.xs}`,
  },
}));

const ChevronIcon = styled.span<{ $isOpen: boolean }>(({ $isOpen }) => ({
  display: 'inline-flex',
  flex: '0 0 auto',
  transform: $isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 160ms ease-out',

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));

const AccordionPanel = styled.div({
  display: 'grid',
  gridTemplateRows: '0fr',
  overflow: 'hidden',
  transition: 'grid-template-rows 180ms ease-out, visibility 0s linear 180ms',
  visibility: 'hidden',

  '&[data-state="open"]': {
    gridTemplateRows: '1fr',
    transition: 'grid-template-rows 180ms ease-out',
    visibility: 'visible',
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});

const AccordionPanelInner = styled.div<{ $isOpen: boolean }>(
  ({ $isOpen, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    minHeight: 0,
    overflow: 'hidden',
    padding: $isOpen
      ? `${theme.spacing.s} ${theme.spacing.xl} ${theme.spacing.lg}`
      : `${theme.spacing.none} ${theme.spacing.xl}`,
    transition: 'padding 180ms ease-out',

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  }),
);

const InfoItem = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const InfoDivider = styled.div(({ theme }) => ({
  flex: '0 0 auto',
  width: '100%',
  height: 0,
  borderTop: `1px solid ${theme.color.border.subtle}`,
}));
