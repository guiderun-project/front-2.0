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
  const [hasSubmitAttempted, setHasSubmitAttempted] = useState(false);

  const setField = <Key extends keyof MyEditFormValues>(
    key: Key,
    value: MyEditFormValues[Key],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const birthDateISO = toBirthDateISO(values.birthDate);
  const isBirthDateValid = birthDateISO !== null;
  const isPhoneValid = isValidKoreanPhone(values.phoneNumber);

  // 타이핑 중에는 입력을 마친 필드에만 오류를 보여준다(생년월일은 8자를 다 채웠을 때,
  // 전화번호는 한 글자라도 입력했을 때). 저장을 시도한 뒤부터는 빈 필수 값도 안내한다.
  const hasBirthDateError =
    (values.birthDate.length === BIRTH_DATE_MAX_LENGTH || hasSubmitAttempted) &&
    !isBirthDateValid;
  const hasPhoneError =
    (values.phoneNumber.length > 0 || hasSubmitAttempted) && !isPhoneValid;

  const buildRequestBody = (): UpdatePersonalInfoRequest | null => {
    if (birthDateISO === null || !isPhoneValid) {
      return null;
    }

    const body: UpdatePersonalInfoRequest = {
      birthDate: birthDateISO,
      phoneNumber: values.phoneNumber,
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

  /**
   * 저장 시도 시점의 검증. 에러 노출을 켜고 유효 여부를 반환한다.
   * 오류 표시와 호출측 포커스 이동이 같은 이벤트에서 일어나야 하므로 동기 함수다.
   */
  const validate = (): boolean => {
    setHasSubmitAttempted(true);

    return isBirthDateValid && isPhoneValid;
  };

  /** 내 정보를 저장한다. 성공하면 true, 실패하면 false 를 반환한다. */
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
    isSubmitting: isPending,
    validate,
    submit,
  };
};
