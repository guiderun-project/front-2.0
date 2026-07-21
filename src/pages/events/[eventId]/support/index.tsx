import { useEffect, useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import {
  BottomSheet,
  Button,
  HiddenText,
  PageLayout,
  Text,
  TopNavigation,
} from '@/components';
import { APP_PATH } from '@/router/path';

import {
  TRANSPORT_SUPPORT_DATA,
  type TransportSupportRegion,
} from './transportSupportData';

export const EventSupportPage = (): ReactElement => {
  const navigate = useNavigate();
  const heroSectionRef = useRef<HTMLElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<TransportSupportRegion | null>(null);

  // 라우트 진입 시 페이지 제목(h1)으로 포커스를 옮겨 스크린리더가 제목부터 낭독하도록 한다.
  // RouteFocusManager 의 rAF 보다 먼저 activeElement 를 채워야 매니저의 body 가드가
  // 작동해 main→h1 이중 포커스가 생기지 않으므로, NotFoundPage·signup 단계 전환과
  // 동일하게 effect 안에서 동기적으로 focus 한다.
  // (문서 title 갱신·낭독은 라우터의 PageTitle/RouteAnnouncer가 담당)
  useEffect(() => {
    const heading = heroSectionRef.current?.querySelector<HTMLElement>('h1');

    if (!heading) {
      return;
    }

    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(APP_PATH.EVENTS);
  };

  const handleCloseSheet = () => {
    setSelectedRegion(null);
  };

  return (
    <SupportPageLayout background="bg.subtle">
      <TopNavigation
        left={{
          icon: 'chevron-left-lined',
          ariaLabel: '이전 페이지로 이동',
          onClick: handleBack,
        }}
      />

      <HeroSection ref={heroSectionRef}>
        <HeroTitle as="h1" color="text.primary" font="heading-m-sb">
          <HiddenText>이동 지원이 필요한 지역을 선택해주세요</HiddenText>
          <span aria-hidden={true}>
            이동 지원이 필요한 지역을
            <br />
            선택해주세요
          </span>
        </HeroTitle>
        <HeroDescription as="p" color="text.secondary" font="body-m-m">
          지역별 KTX 및 이동지원센터 연락처를 알려드려요
        </HeroDescription>
      </HeroSection>

      <RegionSection aria-label="이동지원 지역 선택">
        {/* Safari+VoiceOver는 list-style:none인 ul의 목록 시맨틱을 제거하므로 role="list"를 명시한다. */}
        <RegionGrid role="list">
          {TRANSPORT_SUPPORT_DATA.map((region) => (
            <RegionItem key={region.id}>
              <RegionButton
                aria-haspopup="dialog"
                type="button"
                onClick={() => setSelectedRegion(region)}
              >
                {region.name}
              </RegionButton>
            </RegionItem>
          ))}
        </RegionGrid>
      </RegionSection>

      <SupportContactSheet region={selectedRegion} onClose={handleCloseSheet} />
    </SupportPageLayout>
  );
};

type SupportContactSheetProps = {
  region: TransportSupportRegion | null;
  onClose: () => void;
};

type TransportContact = TransportSupportRegion['mobilityCenter']['contacts'][number];

const SupportContactSheet = ({
  onClose,
  region,
}: SupportContactSheetProps): ReactElement => {
  return (
    <BottomSheet
      footer={
        <Button fullWidth size="l" onClick={onClose}>
          확인
        </Button>
      }
      open={region !== null}
      topBarTitle={
        <>
          이동지원 연락처
          {/* 시트 내용에 지역명이 없을 수 있어(예: 부산 '두리발') 대화상자 이름에 지역명을 포함한다. */}
          {region ? <HiddenText>{` ${region.name}`}</HiddenText> : null}
        </>
      }
      onClose={onClose}
    >
      {region ? (
        <SheetContent>
          <ContactRow>
            <ContactLabelFrame $width={150}>
              <ContactLabel color="text.secondary" font="body-m-sb">
                {region.mobilityCenter.name}
              </ContactLabel>
            </ContactLabelFrame>
            <ContactValueList role="list">
              {region.mobilityCenter.contacts.map((contact) => (
                <ContactValue key={`${contact.desc ?? 'default'}-${contact.number}`}>
                  {/* 링크 aria-label이 설명+번호를 모두 담고 있어 접두 텍스트는 낭독에서 제외해 중복을 막는다. */}
                  <span aria-hidden={true}>{formatTransportContact(contact)}</span>
                  <PhoneLink
                    $variant="primary"
                    href={buildTelHref(contact.number)}
                    aria-label={`${formatTransportContact(contact)}${contact.number} 전화 연결`}
                  >
                    {contact.number}
                  </PhoneLink>
                </ContactValue>
              ))}
            </ContactValueList>
          </ContactRow>

          {region.ktx.length > 0 ? (
            <ContactRow>
              <ContactLabelFrame $width={84}>
                <ContactLabel color="text.secondary" font="body-m-sb">
                  KTX 연락처
                </ContactLabel>
              </ContactLabelFrame>
              <ContactValueList $isNowrap={true} role="list">
                {region.ktx.map((station) => (
                  <ContactValue key={`${station.name}-${station.number}`}>
                    {/* 링크 aria-label이 역명+번호를 모두 담고 있어 접두 텍스트는 낭독에서 제외해 중복을 막는다. */}
                    <span aria-hidden={true}>{`${station.name} : `}</span>
                    <PhoneLink
                      $variant="brand"
                      href={buildTelHref(station.number)}
                      aria-label={`${station.name} ${station.number} 전화 연결`}
                    >
                      {station.number}
                    </PhoneLink>
                  </ContactValue>
                ))}
              </ContactValueList>
            </ContactRow>
          ) : null}
        </SheetContent>
      ) : null}
    </BottomSheet>
  );
};

const formatTransportContact = (contact: TransportContact) => {
  return contact.desc ? `${contact.desc} : ` : '';
};

const buildTelHref = (number: string) => {
  return `tel:${number.replace(/[^\d+]/g, '')}`;
};

const SupportPageLayout = styled(PageLayout)({
  display: 'flex',
  flexDirection: 'column',
});

const HeroSection = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing.lg,
  width: '100%',
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['3xl']}`,
}));

const HeroTitle = styled(Text)({
  display: 'block',
});

const HeroDescription = styled(Text)({
  display: 'block',
});

const RegionSection = styled.section(({ theme }) => ({
  flex: '1 1 auto',
  width: '100%',
  padding: theme.spacing['2xl'],
}));

const RegionGrid = styled.ul(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: theme.spacing.md,
  width: '100%',
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const RegionItem = styled.li({
  minWidth: 0,
});

const RegionButton = styled.button(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: theme.pxToRem(54),
  padding: `0 ${theme.spacing.xl}`,
  border: `${theme.pxToRem(1.8)} solid ${theme.color.border.default}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.default,
  color: theme.color.text.secondary,
  cursor: 'pointer',
  textAlign: 'center',
  touchAction: 'manipulation',
  transition: 'background-color 120ms ease, border-color 120ms ease, transform 120ms ease',
  wordBreak: 'keep-all',
  ...theme.typography['body-l-sb'],

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.color.bg.overlay,
    },
  },

  '&:active': {
    backgroundColor: theme.color.bg.surface,
    borderColor: theme.color.border.subtle,
    transform: 'scale(0.98)',
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',

    '&:active': {
      transform: 'none',
    },
  },
}));

const SheetContent = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing['3xl'],
  width: '100%',
  padding: `${theme.spacing['2xl']} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
}));

const ContactRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing['2xl'],
  width: '100%',
}));

const ContactLabelFrame = styled.div<{ $width: number }>(({ $width, theme }) => ({
  flex: '0 0 auto',
  width: theme.pxToRem($width),
  minWidth: 0,
}));

const ContactLabel = styled(Text)({
  display: 'block',
  wordBreak: 'keep-all',
});

const ContactValueList = styled.ul<{ $isNowrap?: boolean }>(({ $isNowrap = false, theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  alignItems: 'flex-end',
  minWidth: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  color: theme.color.text.primary,
  textAlign: 'right',
  whiteSpace: $isNowrap ? 'nowrap' : undefined,
  ...theme.typography['body-m-m'],
}));

const ContactValue = styled.li({
  margin: 0,
});

type PhoneLinkVariant = 'primary' | 'brand';

const PhoneLink = styled.a<{ $variant: PhoneLinkVariant }>(({ $variant, theme }) => ({
  color: $variant === 'brand' ? theme.color.text.brand : theme.color.text.primary,
  textDecoration: $variant === 'brand' ? 'underline' : 'none',
  textUnderlineOffset: theme.spacing.xs,
  whiteSpace: 'nowrap',

  '&:focus-visible': {
    borderRadius: theme.radius.s,
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));
