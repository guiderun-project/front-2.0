import { useCallback, useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ConfirmPopup,
  FooterButton,
  FormPageLayout,
  Input,
  PageLayout,
  QueryBoundary,
  Text,
} from '@/components';
import { useRouteBlockerConfirm } from '@/hooks/useRouteBlockerConfirm';
import { APP_PATH } from '@/router/path';
import { BIRTH_DATE_MAX_LENGTH } from '@/utils';

import { AccountSetupSheet } from './components/AccountSetupSheet';
import { useMyEdit } from './hooks/useMyEdit';

const LOADING_MESSAGE = '내 정보를 불러오는 중이에요.';
const ERROR_MESSAGE = '내 정보를 불러오지 못했어요.';

export const ProfileEditView = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <PageLayout background="bg.surface">
      <FormPageLayout
        title={'내 정보를\n수정해주세요'}
        topNavigation={{
          left: {
            icon: 'chevron-left-lined',
            ariaLabel: '뒤로가기',
            onClick: () => navigate(-1),
          },
        }}
      >
        <QueryBoundary
          errorMessage={ERROR_MESSAGE}
          loadingMessage={LOADING_MESSAGE}
        >
          <MyEditContent />
        </QueryBoundary>
      </FormPageLayout>
    </PageLayout>
  );
};

const MyEditContent = (): ReactElement => {
  const navigate = useNavigate();
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const exitResolverRef = useRef<((v: boolean) => void) | null>(null);
  const {
    values,
    accountId,
    setBirthDate,
    setPhoneNumber,
    setSnsId,
    setId1365,
    canEditId1365,
    hasBirthDateError,
    isDirty,
    canSubmit,
    submit,
  } = useMyEdit();

  const handleExitConfirm = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        exitResolverRef.current = resolve;
        setIsExitConfirmOpen(true);
      }),
    [],
  );

  useRouteBlockerConfirm({ enabled: isDirty, onConfirm: handleExitConfirm });

  // 이미 아이디가 있으면 로그인 정보 설정 섹션을 노출하지 않는다.
  const hasAccountId = Boolean(accountId);

  const handleSubmit = async () => {
    const isSucceeded = await submit();

    if (isSucceeded) {
      navigate(APP_PATH.MY);
    }
  };

  return (
    <>
      <Section aria-label="기본 정보">
        <Text color="text.secondary" font="body-m-sb">
          기본 정보
        </Text>
        <Input
          errorText={
            hasBirthDateError ? '올바른 생년월일을 입력해주세요.' : undefined
          }
          inputMode="numeric"
          label="생년월일"
          maxLength={BIRTH_DATE_MAX_LENGTH}
          value={values.birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
        />
        <Input
          inputMode="numeric"
          label="전화번호"
          value={values.phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
        <Input
          label="SNS 계정"
          value={values.snsId}
          onChange={(event) => setSnsId(event.target.value)}
        />
        {canEditId1365 ? (
          <Input
            label="1365 계정"
            value={values.id1365}
            onChange={(event) => setId1365(event.target.value)}
          />
        ) : null}
      </Section>

      {!hasAccountId ? (
        <>
          <Divider aria-hidden={true} />

          <Section aria-label="로그인 정보">
            <SectionHeading>
              <Text as="h2" color="text.primary" font="body-l-sb">
                로그인 정보
              </Text>
              <Text as="p" color="text.tertiary" font="body-m-m">
                설정해두면 나중에 아이디로 로그인 할 수 있어요
              </Text>
            </SectionHeading>
            <Button
              fullWidth
              level="line-type"
              rightIcon={{ icon: 'chevron-right-lined' }}
              size="l"
              onClick={() => setIsAccountSheetOpen(true)}
            >
              아이디 설정하기
            </Button>
          </Section>
        </>
      ) : null}

      <FooterButton>
        <FooterButton.Button
          disabled={!canSubmit}
          fullWidth
          size="l"
          onClick={handleSubmit}
        >
          정보 수정 완료
        </FooterButton.Button>
      </FooterButton>

      <AccountSetupSheet
        accountId={accountId}
        open={isAccountSheetOpen}
        onClose={() => setIsAccountSheetOpen(false)}
      />

      <ConfirmPopup
        cancelText="아니요"
        confirmText="네, 그만할게요"
        description="지금까지 입력한 정보는 저장되지 않아요."
        open={isExitConfirmOpen}
        title="수정을 그만할까요?"
        onCancel={() => {
          exitResolverRef.current?.(false);
          setIsExitConfirmOpen(false);
        }}
        onConfirm={() => {
          exitResolverRef.current?.(true);
          setIsExitConfirmOpen(false);
        }}
        onOpenChange={setIsExitConfirmOpen}
      />
    </>
  );
};

const Section = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing['2xl'],
  paddingTop: theme.spacing['4xl'],
}));

const SectionHeading = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  marginBottom: theme.spacing.xs,

  'h2, p': {
    margin: 0,
  },
}));

const Divider = styled.div(({ theme }) => ({
  height: theme.pxToRem(12),
  backgroundColor: theme.color.border.subtle,
}));
