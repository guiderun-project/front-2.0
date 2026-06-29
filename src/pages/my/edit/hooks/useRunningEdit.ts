import { useMemo, useRef, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/services';
import type { UpdateRunningInfoRequest } from '@/api/types';
import type { TimeValue } from '@/components';
import { useAuth } from '@/contexts';
import {
  deriveRunningGroup,
  hasRunningRecord,
  type RunnerRecordGroup,
} from '@/constants';
import { useMyPage } from '@/pages/my/hooks/useMyPage';
import { myQueryKeys } from '@/pages/my/queryKeys';

export const HOPE_PREFS_MAX_LENGTH = 100;

const EMPTY_RECORD: TimeValue = { hours: '', minutes: '', seconds: '' };

/** 회원가입과 동일한 "HH:MM:SS" 10KM 기록 형식만 시:분:초로 역파싱한다. */
const DETAIL_RECORD_PATTERN = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;

const parseDetailRecord = (detailRecord: string | null): TimeValue => {
  const match = detailRecord ? DETAIL_RECORD_PATTERN.exec(detailRecord) : null;

  if (!match) {
    return EMPTY_RECORD;
  }

  return { hours: match[1], minutes: match[2], seconds: match[3] };
};

/** 10KM 기록 입력을 회원가입과 동일한 API 전송용 "HH:MM:SS" 문자열로 만든다. 기록이 없으면 null. */
const formatDetailRecord = (record: TimeValue): string | null => {
  if (!hasRunningRecord(record)) {
    return null;
  }

  const pad = (value: string) =>
    (Number(value) || 0).toString().padStart(2, '0');

  return `${pad(record.hours)}:${pad(record.minutes)}:${pad(record.seconds)}`;
};

type RunningEditFormValues = {
  recordDegree: RunnerRecordGroup;
  record: TimeValue;
  hopePrefs: string;
};

export const useRunningEdit = () => {
  const queryClient = useQueryClient();
  const { refreshUser, user } = useAuth();
  const { data } = useMyPage();
  const { runningInfo } = data;
  const userType = runningInfo.type;

  // 사용자가 러닝 그룹을 직접 바꿨는지 추적한다. 바꿨다면 기록 변경에 따른 자동 갱신을 멈춘다.
  const isRecordDegreeEditedRef = useRef(false);

  const initialValues = useMemo<RunningEditFormValues>(
    () => ({
      recordDegree: runningInfo.recordDegree as RunnerRecordGroup,
      record: parseDetailRecord(runningInfo.detailRecord),
      hopePrefs: runningInfo.hopePrefs ?? '',
    }),
    [runningInfo],
  );

  const [values, setValues] = useState<RunningEditFormValues>(initialValues);

  const setField = <Key extends keyof RunningEditFormValues>(
    key: Key,
    value: RunningEditFormValues[Key],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const detailRecord = formatDetailRecord(values.record);

  const isRecordDirty =
    values.record.hours !== initialValues.record.hours ||
    values.record.minutes !== initialValues.record.minutes ||
    values.record.seconds !== initialValues.record.seconds;

  const isDirty =
    values.recordDegree !== initialValues.recordDegree ||
    isRecordDirty ||
    values.hopePrefs !== initialValues.hopePrefs;

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (body: UpdateRunningInfoRequest) => api.user.runningPatch(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: myQueryKeys.myPage(user?.userId),
        }),
        refreshUser(),
      ]);
    },
  });

  // 10KM 기록은 필수. 기록이 없으면 0이라도 입력해야 한다(0 허용).
  const isRecordFilled = hasRunningRecord(values.record);
  const recordError = isRecordFilled
    ? undefined
    : '10KM 러닝기록을 입력해주세요.';

  const canSubmit = isDirty && isRecordFilled && !isPending;

  /** 변경된 러닝 정보를 저장한다. 성공하면 true, 실패하면 false 를 반환한다. */
  const submit = async (): Promise<boolean> => {
    if (!canSubmit) {
      return false;
    }

    try {
      await mutateAsync({
        recordDegree: values.recordDegree,
        detailRecord,
        hopePrefs: values.hopePrefs.trim() || null,
      });

      return true;
    } catch {
      return false;
    }
  };

  return {
    values,
    userType,
    setRecordDegree: (value: RunnerRecordGroup) => {
      isRecordDegreeEditedRef.current = true;
      setField('recordDegree', value);
    },
    // 그룹을 직접 바꾸기 전까지는 10KM 기록으로 러닝 그룹 기본값을 자동 갱신한다.
    setRecord: (value: TimeValue) =>
      setValues((prev) => ({
        ...prev,
        record: value,
        recordDegree: isRecordDegreeEditedRef.current
          ? prev.recordDegree
          : deriveRunningGroup(value, userType),
      })),
    setHopePrefs: (value: string) => setField('hopePrefs', value),
    recordError,
    isDirty,
    canSubmit,
    isSubmitting: isPending,
    submit,
  };
};
