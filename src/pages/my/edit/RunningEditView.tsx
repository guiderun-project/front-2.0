import { useCallback, useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import {
  ConfirmPopup,
  FooterButton,
  FormPageLayout,
  PageLayout,
  QueryBoundary,
  Select,
  Textarea,
  TimeInput,
  type SelectOptions,
} from '@/components';
import { TRAINING_RECORD_LABELS, type RunnerRecordGroup } from '@/constants';
import { useRouteBlockerConfirm } from '@/hooks/useRouteBlockerConfirm';
import { APP_PATH } from '@/router/path';

import { HOPE_PREFS_MAX_LENGTH, useRunningEdit } from './hooks/useRunningEdit';

const LOADING_MESSAGE = '러닝 정보를 불러오는 중이에요.';
const ERROR_MESSAGE = '러닝 정보를 불러오지 못했어요.';

const RECORD_GROUPS: readonly RunnerRecordGroup[] = ['A', 'B', 'C', 'D', 'E'];

export const RunningEditView = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <PageLayout background="bg.subtle">
      <FormPageLayout
        title={'내 러닝정보를\n수정해주세요'}
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
          <MyRunningEditContent />
        </QueryBoundary>
      </FormPageLayout>
    </PageLayout>
  );
};

const MyRunningEditContent = (): ReactElement => {
  const navigate = useNavigate();
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const exitResolverRef = useRef<((v: boolean) => void) | null>(null);
  const {
    values,
    userType,
    setRecordDegree,
    setRecord,
    setHopePrefs,
    recordError,
    isDirty,
    canSubmit,
    submit,
  } = useRunningEdit();

  const handleExitConfirm = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        exitResolverRef.current = resolve;
        setIsExitConfirmOpen(true);
      }),
    [],
  );

  useRouteBlockerConfirm({ enabled: isDirty, onConfirm: handleExitConfirm });

  const recordGroupOptions: SelectOptions<RunnerRecordGroup> =
    RECORD_GROUPS.map((group) => ({
      value: group,
      label: `${group} ${TRAINING_RECORD_LABELS[userType][group]}`,
    }));

  const handleSubmit = async () => {
    const isSucceeded = await submit();

    if (isSucceeded) {
      navigate(APP_PATH.MY);
    }
  };

  return (
    <Fields>
      <TimeInput
        errorText={recordError}
        label="10KM 러닝기록"
        value={values.record}
        onChange={setRecord}
      />
      <Select
        label="러닝 그룹"
        options={recordGroupOptions}
        sheetTitle="러닝 그룹"
        value={values.recordDegree}
        onChange={setRecordDegree}
      />
      <Textarea
        label="희망사항"
        maxLength={HOPE_PREFS_MAX_LENGTH}
        value={values.hopePrefs}
        onChange={(event) => setHopePrefs(event.target.value)}
      />

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
    </Fields>
  );
};

const Fields = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing['2xl'],
  paddingTop: theme.spacing['4xl'],
}));
