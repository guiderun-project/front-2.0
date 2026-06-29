import { useId, useState, type ReactElement } from "react";

import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

import { Icon, PageLayout, Text, TopNavigation } from "@/components";

import { TERMS_SECTIONS, type TermsSection } from "./constants";

export const TermsPage = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <PageLayout background="bg.subtle">
      <TopNavigation
        left={{
          icon: "chevron-left-lined",
          ariaLabel: "뒤로가기",
          onClick: () => navigate(-1),
        }}
      />
      <Content>
        {TERMS_SECTIONS.map((section) => (
          <TermsAccordionItem key={section.key} section={section} />
        ))}
      </Content>
    </PageLayout>
  );
};

const TermsAccordionItem = ({
  section,
}: {
  section: TermsSection;
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(true);
  const panelId = useId();

  return (
    <Card>
      <HeaderButton
        aria-controls={panelId}
        aria-expanded={isOpen}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Title color="text.primary" font="body-l-sb">
          {section.title}
        </Title>
        <ChevronIcon $isOpen={isOpen}>
          <Icon
            aria-hidden={true}
            color="icon.secondary"
            icon="chevron-down-lined"
            size={20}
          />
        </ChevronIcon>
      </HeaderButton>
      <Panel
        data-state={isOpen ? "open" : "closed"}
        id={panelId}
        inert={!isOpen ? true : undefined}
      >
        <PanelInner $isOpen={isOpen}>
          <Divider aria-hidden={true} />
          <Text color="text.tertiary" font="body-s-m">
            {section.body}
          </Text>
        </PanelInner>
      </Panel>
    </Card>
  );
};

const Content = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  paddingInline: theme.spacing["2xl"],
}));

const Card = styled.section(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflow: "hidden",
  borderRadius: "1.25rem",
  backgroundColor: theme.color.bg.elevated,
}));

const HeaderButton = styled.button(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  width: "100%",
  padding: theme.spacing["2xl"],
  paddingTop: theme.spacing["3xl"],
  border: 0,
  background: "transparent",
  cursor: "pointer",
  textAlign: "left",
  touchAction: "manipulation",

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: `-${theme.spacing.xs}`,
  },
}));

const Title = styled(Text)({
  flex: "1 1 0",
  minWidth: 0,
});

const ChevronIcon = styled.span<{ $isOpen: boolean }>(({ $isOpen }) => ({
  display: "inline-flex",
  flex: "0 0 auto",
  transform: $isOpen ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 160ms ease-out",

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}));

const Panel = styled.div({
  display: "grid",
  gridTemplateRows: "0fr",
  overflow: "hidden",
  transition: "grid-template-rows 180ms ease-out, visibility 0s linear 180ms",
  visibility: "hidden",

  '&[data-state="open"]': {
    gridTemplateRows: "1fr",
    transition: "grid-template-rows 180ms ease-out",
    visibility: "visible",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
});

const PanelInner = styled.div<{ $isOpen: boolean }>(({ $isOpen, theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing["2xl"],
  minHeight: 0,
  overflow: "hidden",
  padding: $isOpen
    ? `0 ${theme.spacing["2xl"]} ${theme.spacing["3xl"]}`
    : `0 ${theme.spacing["2xl"]}`,
  transition: "padding 180ms ease-out",
  whiteSpace: "pre-line",

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}));

const Divider = styled.hr(({ theme }) => ({
  width: "100%",
  height: 0,
  margin: 0,
  border: 0,
  borderTop: `1px solid ${theme.color.border.subtle}`,
}));
