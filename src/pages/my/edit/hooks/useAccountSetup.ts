import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/services';
import type { SetAccountRequest } from '@/api/types';
import { useAuth } from '@/contexts';
import { myQueryKeys } from '@/pages/my/queryKeys';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

/** 영문과 특수문자를 포함해 8자 이상 32자 미만인지 검증한다. */
const isValidPassword = (password: string): boolean =>
  password.length >= PASSWORD_MIN_LENGTH &&
  password.length < PASSWORD_MAX_LENGTH &&
  /[a-zA-Z]/.test(password) &&
  /[^a-zA-Z0-9]/.test(password);

type AccountIdStatus = 'unchecked' | 'available' | 'taken';

export const useAccountSetup = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [accountId, setAccountIdValue] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [checkedAccountId, setCheckedAccountId] = useState<string | null>(null);
  const [isCheckedUnique, setIsCheckedUnique] = useState(false);

  const isAccountIdChecked =
    checkedAccountId !== null && checkedAccountId === accountId;
  const accountIdStatus: AccountIdStatus = !isAccountIdChecked
    ? 'unchecked'
    : isCheckedUnique
      ? 'available'
      : 'taken';

  const duplicateCheckMutation = useMutation({
    mutationFn: (nextAccountId: string) =>
      api.user.accountDuplicatedPost({ accountId: nextAccountId }),
  });

  const accountMutation = useMutation({
    mutationFn: (body: SetAccountRequest) => api.user.accountPost(body),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: myQueryKeys.myPage(user?.userId),
      });
    },
  });

  const setAccountId = (value: string) => {
    setAccountIdValue(value.replace(/\s/g, ''));
  };

  const reset = () => {
    setAccountIdValue('');
    setPassword('');
    setPasswordConfirm('');
    setCheckedAccountId(null);
    setIsCheckedUnique(false);
  };

  /** 아이디 중복 여부를 확인한다. */
  const checkAccountIdDuplicate = async () => {
    if (!accountId || duplicateCheckMutation.isPending || isAccountIdChecked) {
      return;
    }

    try {
      const { isUnique } = await duplicateCheckMutation.mutateAsync(accountId);

      setCheckedAccountId(accountId);
      setIsCheckedUnique(isUnique);
    } catch {
      setCheckedAccountId(null);
      setIsCheckedUnique(false);
    }
  };

  const hasPasswordError = password.length > 0 && !isValidPassword(password);
  const hasPasswordConfirmError =
    passwordConfirm.length > 0 && passwordConfirm !== password;

  const canSubmit =
    accountIdStatus === 'available' &&
    isValidPassword(password) &&
    passwordConfirm === password &&
    !accountMutation.isPending;

  /** 아이디/비밀번호를 설정한다. 성공하면 true, 실패하면 false 를 반환한다. */
  const submit = async (): Promise<boolean> => {
    if (!canSubmit) {
      return false;
    }

    try {
      await accountMutation.mutateAsync({ accountId, password });

      return true;
    } catch {
      return false;
    }
  };

  return {
    accountId,
    setAccountId,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    accountIdStatus,
    isCheckingAccountId: duplicateCheckMutation.isPending,
    checkAccountIdDuplicate,
    hasPasswordError,
    hasPasswordConfirmError,
    canSubmit,
    isSubmitting: accountMutation.isPending,
    submit,
    reset,
  };
};
