import { useRef, useState, type ReactElement } from "react";

import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/api/core";
import { api } from "@/api/services";
import { useAuth } from "@/contexts";
import { useAnnouncedMessage } from "@/hooks/useAnnouncedMessage";
import {
  BIRTH_DATE_ERROR_MESSAGE,
  BIRTH_DATE_MAX_LENGTH,
  formatBirthDateInput,
  toBirthDateISO,
} from "@/utils";

import { BottomSheet } from "../BottomSheet";
import { Button } from "../Button";
import { HiddenText } from "../HiddenText";
import { Input } from "../Input";

type BirthDateSheetProps = {
  userName: string;
  onRegistered: () => void;
};

export const BirthDateSheet = ({
  onRegistered,
  userName,
}: BirthDateSheetProps): ReactElement => {
  const { refreshUser } = useAuth();
  const [birthDate, setBirthDate] = useState("");
  const birthDateInputRef = useRef<HTMLInputElement>(null);

  const { error, isError, isPending, mutate, reset } = useMutation({
    mutationFn: (isoDate: string) =>
      api.user.birthDatePatch({ birthDate: isoDate }),
    onSuccess: async () => {
      onRegistered();
      await refreshUser();
    },
  });

  const isoDate = toBirthDateISO(birthDate);
  const hasFormatError =
    birthDate.length === BIRTH_DATE_MAX_LENGTH && isoDate === null;
  const errorText = isError
    ? getApiErrorMessage(
        error,
        "생년월일을 등록하지 못했어요. 다시 시도해주세요.",
      )
    : hasFormatError
      ? BIRTH_DATE_ERROR_MESSAGE
      : undefined;

  // 제출 중에는 버튼이 disabled 되며 포커스가 사라지므로, 진행 상태를
  // 다이얼로그 내부의 상시 마운트 라이브 리전으로 안내한다.
  // (등록 실패 오류는 onError의 포커스 이동으로 aria-describedby가 낭독하는
  //  단일 채널이다. Input 오류 미러는 포커스가 막 도착한 오류의 주입을 생략하고,
  //  타이핑 중 형식 오류만 미러가 낭독한다.)
  const announcedPendingMessage = useAnnouncedMessage(
    isPending ? "등록 중이에요" : "",
  );

  const handleSubmit = () => {
    if (isoDate === null || isPending) {
      return;
    }

    mutate(isoDate, {
      onError: () => {
        // 오류 텍스트가 렌더된 다음 프레임에 입력으로 포커스를 옮겨
        // 라벨과 aria-describedby 오류가 함께 낭독되게 한다.
        // (검증-포커스 흐름에서는 Input 오류 미러가 주입을 생략해 중복 낭독이 없다.)
        window.requestAnimationFrame(() => {
          birthDateInputRef.current?.focus();
        });
      },
    });
  };

  return (
    <BottomSheet
      isBackdropCloseDisabled
      isCloseButtonHidden
      isEscapeCloseDisabled
      heading={{
        subtitle: "더 편한 러닝경험을 위해",
        title: `${userName}님의 생년월일을 알려주세요`,
      }}
      open
      footer={
        <Button
          disabled={isoDate === null || isPending}
          fullWidth
          size="l"
          type="button"
          onClick={handleSubmit}
        >
          입력 완료
        </Button>
      }
    >
      <HiddenText role="status">{announcedPendingMessage}</HiddenText>
      <Content>
        <Input
          controlRef={birthDateInputRef}
          errorText={errorText}
          inputMode="numeric"
          label="생년월일 8자리"
          maxLength={BIRTH_DATE_MAX_LENGTH}
          placeholder="YYYY.MM.DD"
          value={birthDate}
          onChange={(event) => {
            if (isError) {
              reset();
            }

            setBirthDate(formatBirthDateInput(event.target.value));
          }}
        />
      </Content>
    </BottomSheet>
  );
};

const Content = styled.div(({ theme }) => ({
  padding: `${theme.spacing.none} ${theme.spacing["2xl"]} ${theme.spacing["3xl"]}`,
}));
