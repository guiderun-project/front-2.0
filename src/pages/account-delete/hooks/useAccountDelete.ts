import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { api } from "@/api/services";
import { useAuth } from "@/contexts";

import { WITHDRAWAL_CUSTOM_REASON } from "../constants";

export const useAccountDelete = () => {
  const { clearSession } = useAuth();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");

  const isCustomSelected = selectedReason === WITHDRAWAL_CUSTOM_REASON;

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (reasons: string[]) => api.user.withdrawalDelete({ reasons }),
    onSuccess: () => {
      // 탈퇴가 완료되면 더 이상 유효하지 않은 로컬 세션을 정리한다.
      clearSession();
    },
  });

  const buildReasons = (): string[] | null => {
    if (selectedReason === null) {
      return null;
    }

    if (isCustomSelected) {
      const trimmed = customReason.trim();

      return trimmed ? [trimmed] : null;
    }

    return [selectedReason];
  };

  const canSubmit = buildReasons() !== null && !isPending;

  /** 탈퇴를 요청한다. 성공하면 true, 실패하면 false 를 반환한다. */
  const submit = async (): Promise<boolean> => {
    const reasons = buildReasons();

    if (reasons === null || isPending) {
      return false;
    }

    try {
      await mutateAsync(reasons);
      return true;
    } catch {
      return false;
    }
  };

  return {
    selectedReason,
    selectReason: setSelectedReason,
    customReason,
    setCustomReason,
    isCustomSelected,
    canSubmit,
    isSubmitting: isPending,
    submit,
  };
};
