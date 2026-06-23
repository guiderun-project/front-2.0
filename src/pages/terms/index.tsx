import { useId, useState, type ReactElement } from "react";

import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

import { Icon, PageLayout, Text, TopNavigation } from "@/components";

type TermsSection = {
  key: string;
  title: string;
  body: string; // 줄바꿈으로 구분된 약관 본문
};

const TERMS_SECTIONS: TermsSection[] = [
  {
    key: "privacy",
    title: "개인정보 제공 및 활용 동의",
    body: [
      "1. 개인정보 수집, 이용 목적:  참가자를 대상으로 안내성 SMS 발송, 기타 행사를 위한 매칭 등 프로그램 진행을 위해 활용",
      "2. 수집하려는 개인정보 항목:  인적사항(성함, 성별, 나이, 휴대폰 번호, 거주지, 기록, 가이드 러닝 경험 유무, SNS, 카카오톡 아이디",
      "3. 개인 정보의 보유 및 이용 기간:  서비스 가입 시 부터 안내 시까지",
      "4. 동의 거부 시 프로그램 참여가 불가한 점 양해 부탁드립니다.",
    ].join("\n"),
  },
  {
    key: "portrait",
    title: "초상권 활용동의",
    body: [
      "1. 수집 이용 및 제공의 목적 :  SNS 업로드를 통한 홍보 및 기타 채널을 통한 홍보",
      "2. 초상권 보유 및 이용기간 :  홍보한 게시물 삭제시까지",
      "3. 초상권 2차 사용 :  온라인 및 오프라인 홍보물 제작 및 게시",
      "4. 초상권 활용 동의에 거부할 권리가 있으며, 거부 시 교육 홍보물 제작에서 제외되거나 모자이크 처리됩니다.",
      "5. 인격을 침해하지 않는 범위 내에서 저작물에 대한 편집 및 후보정이 이루어질 예정입니다.",
    ].join("\n"),
  },
];

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
