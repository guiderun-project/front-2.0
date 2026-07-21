import type { ReactElement, Ref } from "react";

import styled from "@emotion/styled";

import { Button } from "@/components";

import type { EventFormValues } from "../schema";

type AdditionalQuestionAddActionsProps = {
  isSelectAddDisabled: boolean;
  isTextAddDisabled: boolean;
  /** 마지막 질문 카드 삭제 후 포커스를 복구할 목적지로 쓰인다. */
  textAddButtonRef?: Ref<HTMLButtonElement>;
  onAddQuestion: (
    type: EventFormValues["additionalQuestions"][number]["type"],
  ) => void;
};

export const AdditionalQuestionAddActions = ({
  isSelectAddDisabled,
  isTextAddDisabled,
  textAddButtonRef,
  onAddQuestion,
}: AdditionalQuestionAddActionsProps): ReactElement => (
  <AddActions>
    <Button
      ref={textAddButtonRef}
      disabled={isTextAddDisabled}
      fullWidth
      level="line-type"
      rightIcon={{ icon: "plus-lined" }}
      size="m"
      type="button"
      onClick={() => onAddQuestion("TEXT")}
    >
      질문 추가
    </Button>
    <Button
      disabled={isSelectAddDisabled}
      fullWidth
      level="line-type"
      rightIcon={{ icon: "plus-lined" }}
      size="m"
      type="button"
      onClick={() => onAddQuestion("SELECT")}
    >
      투표 추가
    </Button>
  </AddActions>
);

const AddActions = styled.div(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: theme.spacing.md,
}));
