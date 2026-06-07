import { useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { BottomSheet, Button, PageLayout, Text, TopNavigation } from '@/components';
import { APP_PATH } from '@/router/path';

import {
  TRANSPORT_SUPPORT_DATA,
  type TransportContact,
  type TransportSupportRegion,
} from './transportSupportData';

export const EventSupportPage = (): ReactElement => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<TransportSupportRegion | null>(null);

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

      <HeroSection>
        <HeroTitle as="h1" color="text.primary" font="heading-m-sb">
          이동 지원이 필요한 지역을
          <br />
          선택해주세요
        </HeroTitle>
        <HeroDescription as="p" color="text.secondary" font="body-m-m">
          지역별 KTX 및 이동지원센터 연락처를 알려드려요
        </HeroDescription>
      </HeroSection>

      <RegionSection aria-label="이동지원 지역 선택">
        <RegionGrid>
          {TRANSPORT_SUPPORT_DATA.map((region) => (
            <RegionButton
              key={region.id}
              type="button"
              onClick={() => setSelectedRegion(region)}
            >
              {region.name}
            </RegionButton>
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
      topBarTitle="이동지원 연락처"
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
            <ContactValueList>
              {region.mobilityCenter.contacts.map((contact) => (
                <ContactValue key={`${contact.desc ?? 'default'}-${contact.number}`}>
                  {formatTransportContact(contact)}
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
              <ContactValueList $isNowrap={true}>
                {region.ktx.map((station) => (
                  <ContactValue key={`${station.name}-${station.number}`}>
                    {station.name} :{' '}
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

const RegionGrid = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: theme.spacing.md,
  width: '100%',
}));

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

const ContactValueList = styled.div<{ $isNowrap?: boolean }>(({ $isNowrap = false, theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  alignItems: 'flex-end',
  minWidth: 0,
  color: theme.color.text.primary,
  textAlign: 'right',
  whiteSpace: $isNowrap ? 'nowrap' : undefined,
  ...theme.typography['body-m-m'],
}));

const ContactValue = styled.p({
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
