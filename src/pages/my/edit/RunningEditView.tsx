import { useCallback, useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import {
  ConfirmPopup,
  FooterButton,
  FormPageLayout,
  HiddenText,
  PageLayout,
  QueryBoundary,
  Select,
  Textarea,
  TimeInput,
  useToast,
  type SelectOptions,
  type TimeValue,
} from '@/components';
import {
  deriveRunningGroupIfComplete,
  TRAINING_RECORD_LABELS,
  TRAINING_RECORD_SR_LABELS,
  type RunnerRecordGroup,
} from '@/constants';
import { useRouteBlockerConfirm } from '@/hooks/useRouteBlockerConfirm';
import { useAnnouncedMessage } from '@/hooks/useAnnouncedMessage';
import { APP_PATH } from '@/router/path';

import { HOPE_PREFS_MAX_LENGTH, useRunningEdit } from './hooks/useRunningEdit';

const LOADING_MESSAGE = '러닝 정보를 불러오는 중이에요.';
const ERROR_MESSAGE = '러닝 정보를 불러오지 못했어요.';
const SUBMIT_FAILURE_MESSAGE = '정보 수정에 실패했어요. 다시 시도해주세요.';

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
  const { showToast } = useToast();
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

  const { allowNavigation } = useRouteBlockerConfirm({
    enabled: isDirty,
    onConfirm: handleExitConfirm,
  });

  const [submitFailure, setSubmitFailure] = useState({ message: '', revision: 0 });
  const announcedSubmitFailure = useAnnouncedMessage(
    submitFailure.message,
    submitFailure.revision,
  );
  const [groupChangeNotice, setGroupChangeNotice] = useState({
    message: '',
    revision: 0,
  });
  const announcedGroupChangeNotice = useAnnouncedMessage(
    groupChangeNotice.message,
    groupChangeNotice.revision,
  );

  const recordGroupOptions: SelectOptions<RunnerRecordGroup> =
    RECORD_GROUPS.map((group) => ({
      value: group,
      label: `${group} ${TRAINING_RECORD_LABELS[userType][group]}`,
      // "A ~50분"의 물결표는 낭독에서 생략되므로 "A 50분 이하"로 풀어 읽는다.
      srLabel: `${group} ${TRAINING_RECORD_SR_LABELS[userType][group]}`,
    }));

  // 기록 6자리 완성 시 러닝 그룹이 조용히 자동 변경되므로(setRecord),
  // 기록 입력 필드에 포커스 중인 스크린리더 사용자에게 변경을 안내한다.
  const handleRecordChange = (value: TimeValue) => {
    const nextGroup = deriveRunningGroupIfComplete(value, userType);

    if (nextGroup !== null && nextGroup !== values.recordDegree) {
      setGroupChangeNotice((previous) => ({
        message: `러닝 그룹이 ${nextGroup} ${TRAINING_RECORD_SR_LABELS[userType][nextGroup]} 그룹으로 변경되었어요`,
        revision: previous.revision + 1,
      }));
    }

    setRecord(value);
  };

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
    <Fields>
      <HiddenText role="status">{announcedGroupChangeNotice}</HiddenText>
      <HiddenText role="alert">{announcedSubmitFailure}</HiddenText>
      <TimeInput
        errorText={recordError}
        label="10KM 러닝기록"
        value={values.record}
        onChange={handleRecordChange}
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
