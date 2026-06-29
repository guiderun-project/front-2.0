import { useMemo, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/services';
import type { UpdateRunningInfoRequest } from '@/api/types';
import type { TimeValue } from '@/components';
import { useAuth } from '@/contexts';
import type { RunnerRecordGroup } from '@/constants';
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

// 시/분/초 중 하나라도 입력되어 있으면 기록이 있다고 본다.
const hasRecordInput = (record: TimeValue): boolean =>
  record.hours !== '' || record.minutes !== '' || record.seconds !== '';

/** 10KM 기록 입력을 회원가입과 동일한 API 전송용 "HH:MM:SS" 문자열로 만든다. 기록이 없으면 null. */
const formatDetailRecord = (record: TimeValue): string | null => {
  if (!hasRecordInput(record)) {
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

  const canSubmit = isDirty && !isPending;

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
    userType: runningInfo.type,
    setRecordDegree: (value: RunnerRecordGroup) =>
      setField('recordDegree', value),
    setRecord: (value: TimeValue) => setField('record', value),
    setHopePrefs: (value: string) => setField('hopePrefs', value),
    isDirty,
    canSubmit,
    isSubmitting: isPending,
    submit,
  };
};
