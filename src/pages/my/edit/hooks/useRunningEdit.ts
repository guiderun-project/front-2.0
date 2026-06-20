import { useMemo, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/services';
import type { UpdateRunningInfoRequest } from '@/api/types';
import { useAuth } from '@/contexts';
import type { RunnerRecordGroup } from '@/constants';
import { useMyPage } from '@/pages/my/hooks/useMyPage';
import { myQueryKeys } from '@/pages/my/queryKeys';

export const HOPE_PREFS_MAX_LENGTH = 100;

/** "{거리}KM {시간}분" 형식만 거리/시간으로 역파싱한다. */
const DETAIL_RECORD_PATTERN = /^(\d+(?:\.\d+)?)KM (\d+)분$/;

const parseDetailRecord = (
  detailRecord: string | null,
): { distance: string; time: string } => {
  const match = detailRecord ? DETAIL_RECORD_PATTERN.exec(detailRecord) : null;

  if (!match) {
    return { distance: '', time: '' };
  }

  return { distance: match[1], time: match[2] };
};

/** 거리 입력에서 숫자와 소수점만 남기고 소수점 이하 3자리로 제한한다. */
const formatDistanceInput = (raw: string): string => {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const [whole = '', ...rest] = cleaned.split('.');

  return rest.length === 0 ? whole : `${whole}.${rest.join('').slice(0, 3)}`;
};

type RunningEditFormValues = {
  recordDegree: RunnerRecordGroup;
  distance: string;
  time: string;
  hopePrefs: string;
};

export const useRunningEdit = () => {
  const queryClient = useQueryClient();
  const { refreshUser, user } = useAuth();
  const { data } = useMyPage();
  const { runningInfo } = data;

  const initialValues = useMemo<RunningEditFormValues>(() => {
    const { distance, time } = parseDetailRecord(runningInfo.detailRecord);

    return {
      recordDegree: runningInfo.recordDegree as RunnerRecordGroup,
      distance,
      time,
      hopePrefs: runningInfo.hopePrefs ?? '',
    };
  }, [runningInfo]);

  const [values, setValues] = useState<RunningEditFormValues>(initialValues);

  const setField = <Key extends keyof RunningEditFormValues>(
    key: Key,
    value: RunningEditFormValues[Key],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const distance = values.distance.trim();
  const time = values.time.trim();
  // 거리와 시간은 짝으로 입력해야 한다. 한쪽만 채워진 상태는 미완성으로 본다.
  const hasIncompleteRecord = (distance === '') !== (time === '');
  const detailRecord = distance && time ? `${distance}KM ${time}분` : null;

  const isDirty =
    values.recordDegree !== initialValues.recordDegree ||
    values.distance !== initialValues.distance ||
    values.time !== initialValues.time ||
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

  const canSubmit = isDirty && !hasIncompleteRecord && !isPending;

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
    setDistance: (value: string) =>
      setField('distance', formatDistanceInput(value)),
    setTime: (value: string) => setField('time', value.replace(/\D/g, '')),
    setHopePrefs: (value: string) => setField('hopePrefs', value),
    canSubmit,
    isSubmitting: isPending,
    submit,
  };
};
