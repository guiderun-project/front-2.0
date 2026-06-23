import { type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import {
  FooterButton,
  FormPageLayout,
  Input,
  PageLayout,
  QueryBoundary,
  Select,
  Text,
  Textarea,
  type SelectOptions,
} from '@/components';
import { TRAINING_RECORD_LABELS, type RunnerRecordGroup } from '@/constants';
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
  const {
    values,
    userType,
    setRecordDegree,
    setDistance,
    setTime,
    setHopePrefs,
    canSubmit,
    submit,
  } = useRunningEdit();

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
      <Select
        label="러닝 그룹"
        options={recordGroupOptions}
        sheetTitle="러닝 그룹"
        value={values.recordDegree}
        onChange={setRecordDegree}
      />

      <RecordRow>
        <RecordField
          inputMode="decimal"
          label="러닝거리"
          trailing={
            <Unit color="text.primary" font="body-l-m">
              KM
            </Unit>
          }
          value={values.distance}
          onChange={(event) => setDistance(event.target.value)}
        />
        <RecordField
          inputMode="numeric"
          label="시간"
          trailing={
            <Unit color="text.primary" font="body-l-m">
              분
            </Unit>
          }
          value={values.time}
          onChange={(event) => setTime(event.target.value)}
        />
      </RecordRow>

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

const RecordRow = styled.div(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing.md,
}));

const RecordField = styled(Input)({
  flex: 1,
  minWidth: 0,
});

const Unit = styled(Text)({
  flexShrink: 0,
});
