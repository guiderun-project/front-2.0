import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { EventApplicantFormResponse, EventType, RunningGroup } from '@/api/types';
import { BottomSheet, ButtonGroup, Text } from '@/components';

import {
  COMPETITION_COURSE_LABELS,
  EVENT_VISIBLE_RUNNING_GROUPS,
  type EventVisibleRunningGroup,
} from '../constants';
import { copyTextToClipboard } from '../utils';
import { PanelState } from './PanelState';

const EMPTY_VALUE = '미입력';

type ApplicantFormSheetProps = {
  data?: EventApplicantFormResponse;
  eventType: EventType;
  isError: boolean;
  isPending: boolean;
  open: boolean;
  onClose: () => void;
};

type ApplicantFormRow = {
  id: string;
  label: string;
  value: string;
};

export const ApplicantFormSheet = ({
  data,
  eventType,
  isError,
  isPending,
  onClose,
  open,
}: ApplicantFormSheetProps): ReactElement => {
  const rows = data ? createApplicantFormRows(data, eventType) : [];
  const canCopy = rows.length > 0 && !isPending && !isError;

  const handleCopy = () => {
    if (!canCopy) {
      return;
    }

    void copyTextToClipboard(formatRowsForCopy(rows)).then((isCopied) => {
      // TODO: 공용 토스트나 스낵바가 준비되면 window.alert 대체
      window.alert(
        isCopied
          ? '신청서 내용을 복사했어요.'
          : '신청서 내용 복사에 실패했어요.',
      );
    });
  };

  return (
    <BottomSheet
      footer={
        <SheetButtonGroup ratio="100:100">
          <ButtonGroup.Button
            disabled={!canCopy}
            level="secondary"
            size="l"
            onClick={handleCopy}
          >
            신청서 내용 복사
          </ButtonGroup.Button>
          <ButtonGroup.Button size="l" onClick={onClose}>
            확인
          </ButtonGroup.Button>
        </SheetButtonGroup>
      }
      open={open}
      topBarTitle="신청서 확인"
      onClose={onClose}
    >
      {/* TODO: 디자인 확정 시 신청서 로딩/에러/빈 상태 UI로 교체 */}
      {isPending ? (
        <PanelState>신청서를 불러오는 중입니다.</PanelState>
      ) : null}
      {isError ? (
        <PanelState>신청서를 불러오지 못했습니다.</PanelState>
      ) : null}
      {!isPending && !isError && !data ? (
        <PanelState>신청서 정보를 선택해주세요.</PanelState>
      ) : null}
      {!isPending && !isError && data ? (
        <SheetContent>
          {rows.map((row) => (
            <FormRow key={row.id}>
              <FormLabel color="text.secondary" font="body-m-sb">
                {row.label}
              </FormLabel>
              <FormValue align="right" color="text.primary" font="body-m-m">
                {row.value}
              </FormValue>
            </FormRow>
          ))}
        </SheetContent>
      ) : null}
    </BottomSheet>
  );
};

const createApplicantFormRows = (
  data: EventApplicantFormResponse,
  eventType: EventType,
): ApplicantFormRow[] => {
  const rows: ApplicantFormRow[] = [
    {
      id: 'name',
      label: '이름',
      value: getDisplayValue(data.applicant.name),
    },
  ];

  if (eventType === 'COMPETITION') {
    rows.push(
      {
        id: 'birthDate',
        label: '생년월일',
        value: getDisplayValue(data.applicant.birthDate),
      },
      {
        id: 'phoneNumber',
        label: '전화번호',
        value: getDisplayValue(data.applicant.phoneNumber),
      },
    );
  }

  rows.push(
    {
      id: 'applyGroup',
      label: eventType === 'COMPETITION' ? '참가 희망 코스' : '훈련 희망팀',
      value: formatApplyGroup(data.form.applyGroup, eventType),
    },
    {
      id: 'hopePartner',
      label: '희망 파트너',
      value: getDisplayValue(data.form.hopePartner),
    },
    {
      id: 'additionalComment',
      label: '추가 코멘트',
      value: getDisplayValue(data.form.additionalComment),
    },
  );

  rows.push(
    ...data.additionalAnswers.map((answer) => ({
      id: `additionalAnswer-${answer.questionId}`,
      label: getDisplayValue(answer.questionTitle),
      value: getDisplayValue(answer.answer),
    })),
  );

  return rows;
};

const formatApplyGroup = (
  group: RunningGroup,
  eventType: EventType,
): string => {
  if (!isDisplayRunningGroup(group)) {
    return EMPTY_VALUE;
  }

  return eventType === 'COMPETITION'
    ? COMPETITION_COURSE_LABELS[group]
    : `그룹 ${group}`;
};

const isDisplayRunningGroup = (
  group: RunningGroup,
): group is EventVisibleRunningGroup => {
  return EVENT_VISIBLE_RUNNING_GROUPS.some((displayGroup) => displayGroup === group);
};

const getDisplayValue = (value: string | null | undefined): string => {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : EMPTY_VALUE;
};

const formatRowsForCopy = (rows: ApplicantFormRow[]): string => {
  return rows.map((row) => `${row.label}: ${row.value}`).join('\n');
};

const SheetContent = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['3xl'],
  width: '100%',
  padding: `${theme.spacing['2xl']} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
  boxSizing: 'border-box',
}));

const FormRow = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  alignItems: 'flex-start',
  gap: theme.spacing['2xl'],
}));

const FormLabel = styled(Text)({
  minWidth: 0,
  overflowWrap: 'anywhere',
});

const FormValue = styled(Text)({
  minWidth: 0,
  overflowWrap: 'anywhere',
  whiteSpace: 'pre-wrap',
});

const SheetButtonGroup = styled(ButtonGroup)({
  paddingInline: 0,
});
