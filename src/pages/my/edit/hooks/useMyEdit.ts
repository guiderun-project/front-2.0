import { useMemo, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/services';
import type { UpdatePersonalInfoRequest } from '@/api/types';
import { useAuth } from '@/contexts';
import { useMyPage } from '@/pages/my/hooks/useMyPage';
import { myQueryKeys } from '@/pages/my/queryKeys';
import {
  BIRTH_DATE_MAX_LENGTH,
  formatBirthDateInput,
  formatISODateToBirthDateInput,
  isValidKoreanPhone,
  normalizePhoneDigits,
  toBirthDateISO,
} from '@/utils';

type MyEditFormValues = {
  birthDate: string;
  phoneNumber: string;
  snsId: string;
  id1365: string;
};

export const useMyEdit = () => {
  const queryClient = useQueryClient();
  const { refreshUser, user } = useAuth();
  const { data } = useMyPage();
  const { personalInfo } = data;

  // VI 러너는 1365 계정을 수정할 수 없다.
  const canEditId1365 = user?.type !== 'VI';

  const initialValues = useMemo<MyEditFormValues>(
    () => ({
      birthDate: personalInfo.birthDate
        ? formatISODateToBirthDateInput(personalInfo.birthDate)
        : '',
      phoneNumber: normalizePhoneDigits(personalInfo.phoneNumber ?? ''),
      snsId: personalInfo.snsId ?? '',
      id1365: personalInfo.id1365 ?? '',
    }),
    [personalInfo],
  );

  const [values, setValues] = useState<MyEditFormValues>(initialValues);

  const setField = <Key extends keyof MyEditFormValues>(
    key: Key,
    value: MyEditFormValues[Key],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const birthDateISO = toBirthDateISO(values.birthDate);
  const hasBirthDateError =
    values.birthDate.length === BIRTH_DATE_MAX_LENGTH && birthDateISO === null;
  const hasPhoneError =
    values.phoneNumber.length > 0 && !isValidKoreanPhone(values.phoneNumber);

  const buildRequestBody = (): UpdatePersonalInfoRequest | null => {
    const phoneNumber = values.phoneNumber.trim();

    if (birthDateISO === null || !phoneNumber) {
      return null;
    }

    const body: UpdatePersonalInfoRequest = {
      birthDate: birthDateISO,
      phoneNumber,
      snsId: values.snsId.trim() || null,
    };

    if (canEditId1365) {
      body.id1365 = values.id1365.trim() || null;
    }

    return body;
  };

  const isDirty =
    values.birthDate !== initialValues.birthDate ||
    values.phoneNumber !== initialValues.phoneNumber ||
    values.snsId !== initialValues.snsId ||
    (canEditId1365 && values.id1365 !== initialValues.id1365);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (body: UpdatePersonalInfoRequest) =>
      api.user.personalPatch(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: myQueryKeys.myPage(user?.userId),
        }),
        refreshUser(),
      ]);
    },
  });

  const canSubmit =
    buildRequestBody() !== null && isDirty && !isPending && !hasPhoneError;

  /** 변경된 정보를 저장한다. 성공하면 true, 실패하면 false 를 반환한다. */
  const submit = async (): Promise<boolean> => {
    const body = buildRequestBody();

    if (body === null || isPending) {
      return false;
    }

    try {
      await mutateAsync(body);

      return true;
    } catch {
      return false;
    }
  };

  return {
    values,
    accountId: personalInfo.accountId,
    setBirthDate: (value: string) =>
      setField('birthDate', formatBirthDateInput(value)),
    setPhoneNumber: (value: string) =>
      setField('phoneNumber', normalizePhoneDigits(value)),
    setSnsId: (value: string) => setField('snsId', value),
    setId1365: (value: string) => setField('id1365', value),
    canEditId1365,
    hasBirthDateError,
    hasPhoneError,
    isDirty,
    canSubmit,
    isSubmitting: isPending,
    submit,
  };
};
