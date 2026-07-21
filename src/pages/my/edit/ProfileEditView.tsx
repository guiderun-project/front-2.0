import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ConfirmPopup,
  DateInput,
  FooterButton,
  FormPageLayout,
  HiddenText,
  Input,
  PageLayout,
  QueryBoundary,
  Text,
  useToast,
} from '@/components';
import { useRouteBlockerConfirm } from '@/hooks/useRouteBlockerConfirm';
import { useAnnouncedMessage } from '@/hooks/useAnnouncedMessage';
import { APP_PATH } from '@/router/path';
import { getTodayISODate } from '@/utils';

import { AccountSetupSheet } from './components/AccountSetupSheet';
import { useMyEdit } from './hooks/useMyEdit';

const LOADING_MESSAGE = '내 정보를 불러오는 중이에요.';
const ERROR_MESSAGE = '내 정보를 불러오지 못했어요.';
const SUBMIT_FAILURE_MESSAGE = '정보 수정에 실패했어요. 다시 시도해주세요.';
const ACCOUNT_SETUP_SUCCESS_MESSAGE = '아이디를 설정했어요.';
// 시트 exit 애니메이션(180ms)과 react-aria FocusScope 포커스 복원 시도가
// 끝난 뒤에 포커스를 옮기기 위한 지연.
const ACCOUNT_SHEET_EXIT_DELAY_MS = 300;

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
  const { showToast } = useToast();
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const exitResolverRef = useRef<((v: boolean) => void) | null>(null);
  const [submitFailure, setSubmitFailure] = useState({ message: '', revision: 0 });
  const announcedSubmitFailure = useAnnouncedMessage(
    submitFailure.message,
    submitFailure.revision,
  );
  const [accountSetupSuccess, setAccountSetupSuccess] = useState({
    message: '',
    revision: 0,
  });
  const announcedAccountSetupSuccess = useAnnouncedMessage(
    accountSetupSuccess.message,
    accountSetupSuccess.revision,
  );
  const hasPendingAccountSetupSuccessRef = useRef(false);
  const basicInfoSectionRef = useRef<HTMLElement>(null);
  const {
    values,
    accountId,
    setBirthDate,
    setPhoneNumber,
    setSnsId,
    setId1365,
    canEditId1365,
    hasBirthDateError,
    hasPhoneError,
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

  const { allowNavigation } = useRouteBlockerConfirm({
    enabled: isDirty,
    onConfirm: handleExitConfirm,
  });

  // 이미 아이디가 있으면 로그인 정보 설정 섹션을 노출하지 않는다.
  const hasAccountId = Boolean(accountId);

  // 아이디 설정 성공 시 myPage 재조회로 '아이디 설정하기' 트리거 섹션이
  // 언마운트되어 시트가 닫힌 뒤 포커스가 body로 유실된다. 시트가 완전히
  // 닫힌 뒤 '기본 정보' 제목으로 포커스를 옮기고, 바깥 aria-hidden이 풀린
  // 상태에서 성공을 안내한다.
  useEffect(() => {
    if (isAccountSheetOpen || !hasPendingAccountSetupSuccessRef.current) {
      return;
    }

    hasPendingAccountSetupSuccessRef.current = false;

    const timeoutId = window.setTimeout(() => {
      if (document.activeElement === document.body) {
        basicInfoSectionRef.current
          ?.querySelector<HTMLElement>('h2')
          ?.focus({ preventScroll: true });
      }

      setAccountSetupSuccess((previous) => ({
        message: ACCOUNT_SETUP_SUCCESS_MESSAGE,
        revision: previous.revision + 1,
      }));
    }, ACCOUNT_SHEET_EXIT_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isAccountSheetOpen]);

  const handleSubmit = async () => {
    const isSucceeded = await submit();

    if (isSucceeded) {
      allowNavigation();
      navigate(APP_PATH.MY);
      window.setTimeout(() => {
        showToast({
          type: 'success',
          icon: 'check-lined',
          content: '정보 수정이 완료되었어요',
        });
      }, 0);
      return;
    }

    // 실패 시 시각 오류 UI 추가는 기획 협의가 필요해 SR 전용 리전으로만 안내한다.
    setSubmitFailure((previous) => ({
      message: SUBMIT_FAILURE_MESSAGE,
      revision: previous.revision + 1,
    }));
  };

  return (
    <>
      <HiddenText role="status">{announcedAccountSetupSuccess}</HiddenText>
      <HiddenText role="alert">{announcedSubmitFailure}</HiddenText>

      <Section aria-label="기본 정보" ref={basicInfoSectionRef}>
        <Text as="h2" color="text.secondary" font="body-m-sb" tabIndex={-1}>
          기본 정보
        </Text>
        <DateInput
          aria-required={true}
          errorText={
            hasBirthDateError ? '올바른 생년월일을 입력해주세요.' : undefined
          }
          label="생년월일"
          max={getTodayISODate()}
          value={values.birthDate}
          onChange={setBirthDate}
        />
        <Input
          aria-required={true}
          autoComplete="tel-national"
          clearable
          error={hasPhoneError}
          errorText={hasPhoneError ? '올바른 전화번호를 입력해주세요.' : undefined}
          inputMode="numeric"
          label="전화번호"
          type="tel"
          value={values.phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
        <Input
          clearable
          label="SNS 계정"
          value={values.snsId}
          onChange={(event) => setSnsId(event.target.value)}
        />
        {canEditId1365 ? (
          <Input
            clearable
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
        onSetupSuccess={() => {
          hasPendingAccountSetupSuccessRef.current = true;
        }}
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
