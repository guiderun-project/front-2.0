import { useRef, type KeyboardEvent, type ReactElement } from "react";

import styled from "@emotion/styled";
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";

import { HiddenText, Text } from "@/components";

import { ADDITIONAL_TEXT_QUESTION_MAX_COUNT } from "../constants";
import type { EventFormValues } from "../schema";
import { createAdditionalQuestionDraft } from "../utils";
import { useStatusAnnouncement } from "../useStatusAnnouncement";
import { AdditionalQuestionAddActions } from "./AdditionalQuestionAddActions";
import { AdditionalQuestionCard } from "./AdditionalQuestionCard";

// react-hook-form 이 새 필드를 등록/정리한 리렌더 이후에 실행해야 하는 포커스
// 이동을 두 프레임 지연시킨다. (rAF 1회는 커밋 전에 실행될 수 있다)
const focusAfterRerender = (focus: () => void): void => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(focus);
  });
};

type AdditionalQuestionEditorProps = {
  form: UseFormReturn<EventFormValues>;
  readOnly?: boolean;
};

export const AdditionalQuestionEditor = ({
  form,
  readOnly = false,
}: AdditionalQuestionEditorProps): ReactElement => {
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "additionalQuestions",
  });
  const textAddButtonRef = useRef<HTMLButtonElement>(null);
  const { announce, announcedMessage } = useStatusAnnouncement();
  const additionalQuestions =
    useWatch({
      control: form.control,
      name: "additionalQuestions",
    }) ?? [];

  const textQuestionCount = additionalQuestions.filter(
    (question) => question.type === "TEXT",
  ).length;
  const selectQuestionCount = additionalQuestions.filter(
    (question) => question.type === "SELECT",
  ).length;
  const isTextAddDisabled =
    textQuestionCount >= ADDITIONAL_TEXT_QUESTION_MAX_COUNT;
  const isSelectAddDisabled = selectQuestionCount >= 1;

  const handleAddQuestion = (
    type: EventFormValues["additionalQuestions"][number]["type"],
  ) => {
    const nextIndex = fields.length;

    append(createAdditionalQuestionDraft(type));
    // 새 카드의 제목 입력으로 포커스를 옮겨, 추가된 위치와 사실이 라벨과
    // 플레이스홀더 낭독으로 바로 전달되게 한다. (버튼이 disabled 로 바뀌며
    // 포커스가 유실되는 문제도 함께 막는다)
    focusAfterRerender(() => {
      form.setFocus(`additionalQuestions.${nextIndex}.title`);
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const isSelectQuestion = additionalQuestions[index]?.type === "SELECT";
    const remainingCount = fields.length - 1;

    remove(index);
    announce(isSelectQuestion ? "투표를 삭제했어요." : "질문을 삭제했어요.");
    // 포커스를 갖고 있던 삭제 버튼이 카드와 함께 사라지므로, 인접 카드의 제목
    // 입력(없으면 '질문 추가' 버튼)으로 포커스를 명시적으로 복구한다.
    focusAfterRerender(() => {
      if (remainingCount > 0) {
        form.setFocus(
          `additionalQuestions.${Math.min(index, remainingCount - 1)}.title`,
        );
        return;
      }

      textAddButtonRef.current?.focus();
    });
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== "Enter" ||
      event.nativeEvent.isComposing ||
      !(event.target instanceof HTMLInputElement)
    ) {
      return;
    }

    event.preventDefault();
  };

  return (
    <EditorRoot onKeyDown={handleEditorKeyDown}>
      <EditorHeader>
        <Text as="p" color="text.secondary" font="body-m-m">
          {
            "의견을 받을 질문이나 투표를 추가해보세요.\n각각 1개만 추가 가능하며, 생성 후 수정할 수 없어요"
          }
        </Text>
        {readOnly ? null : (
          <AdditionalQuestionAddActions
            isSelectAddDisabled={isSelectAddDisabled}
            isTextAddDisabled={isTextAddDisabled}
            textAddButtonRef={textAddButtonRef}
            onAddQuestion={handleAddQuestion}
          />
        )}
      </EditorHeader>

      {fields.length > 0 ? (
        <QuestionList>
          {fields.map((field, index) => {
            const question = additionalQuestions[index] ?? field;

            return (
              <AdditionalQuestionCard
                key={field.id}
                fieldId={field.id}
                form={form}
                questionIndex={index}
                questionType={question.type}
                readOnly={readOnly}
                onRemove={() => handleRemoveQuestion(index)}
              />
            );
          })}
        </QuestionList>
      ) : null}

      {/* 카드 삭제 안내용 상시 마운트 라이브 리전. */}
      <HiddenText role="status">{announcedMessage}</HiddenText>
    </EditorRoot>
  );
};

const EditorRoot = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.lg,
}));

const EditorHeader = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.lg,

  "& p": {
    whiteSpace: "pre-line",
  },
}));

const QuestionList = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.lg,
}));
