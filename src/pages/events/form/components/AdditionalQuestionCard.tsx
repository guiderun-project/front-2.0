import type { ReactElement } from "react";

import styled from "@emotion/styled";
import { Controller, type UseFormReturn } from "react-hook-form";

import { HiddenText, IconButton, Text } from "@/components";

import { ADDITIONAL_QUESTION_TITLE_MAX_LENGTH } from "../constants";
import type { EventFormValues } from "../schema";
import { AdditionalSelectOptionFields } from "./AdditionalSelectOptionFields";

type AdditionalQuestionCardProps = {
  fieldId: string;
  form: UseFormReturn<EventFormValues>;
  questionIndex: number;
  questionType: EventFormValues["additionalQuestions"][number]["type"];
  readOnly?: boolean;
  onRemove: () => void;
};

export const AdditionalQuestionCard = ({
  fieldId,
  form,
  questionIndex,
  questionType,
  readOnly = false,
  onRemove,
}: AdditionalQuestionCardProps): ReactElement => {
  const title = questionType === "TEXT" ? "질문" : "투표";
  const titleInputId = `${fieldId}-question-title`;
  const titleErrorId = `${fieldId}-question-title-error`;
  const titleCounterId = `${fieldId}-question-title-counter`;

  return (
    <QuestionCard>
      <QuestionCardHeader>
        <Text
          as="label"
          color="text.primary"
          font="body-m-sb"
          htmlFor={titleInputId}
        >
          {title}
        </Text>
        {readOnly ? null : (
          <IconButton
            aria-label={`${title} 삭제`}
            color="icon.secondary"
            icon="delete-filled"
            iconSize={24}
            shape="round"
            size={24}
            type="button"
            onClick={onRemove}
          />
        )}
      </QuestionCardHeader>

      <Controller
        control={form.control}
        name={`additionalQuestions.${questionIndex}.title`}
        render={({ field: titleField, fieldState }) => {
          const hasVisibleError = !readOnly && fieldState.invalid;

          return (
            <QuestionTitleField>
              <QuestionTitleInput
                ref={titleField.ref}
                $hasError={hasVisibleError}
                $readOnly={readOnly}
                aria-describedby={
                  [
                    !readOnly && fieldState.error ? titleErrorId : null,
                    !readOnly ? titleCounterId : null,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                aria-invalid={hasVisibleError || undefined}
                enterKeyHint={questionType === "SELECT" ? "next" : "done"}
                id={titleInputId}
                maxLength={ADDITIONAL_QUESTION_TITLE_MAX_LENGTH}
                name={titleField.name}
                placeholder={
                  questionType === "TEXT"
                    ? "질문을 입력하세요"
                    : "투표 제목을 입력하세요"
                }
                readOnly={readOnly}
                value={titleField.value}
                onBlur={titleField.onBlur}
                onChange={titleField.onChange}
              />
              {readOnly ? null : (
                <InformRow>
                  {fieldState.error ? (
                    <FieldError id={titleErrorId}>
                      {fieldState.error.message}
                    </FieldError>
                  ) : (
                    <span />
                  )}
                  {/* 타이핑마다 낭독되는 aria-live 대신 입력의 aria-describedby 로
                      연결해 포커스 시에만 글자 수 제한이 안내되게 한다. */}
                  <Counter id={titleCounterId} role="text">
                    <Text
                      as="span"
                      color={hasVisibleError ? "text.danger" : "text.brand"}
                      font="body-s-m"
                    >
                      <HiddenText>현재</HiddenText>
                      {titleField.value.length}
                    </Text>
                    <Text as="span" color="text.tertiary" font="body-s-m">
                      /<HiddenText>최대 글자 수</HiddenText>
                      {ADDITIONAL_QUESTION_TITLE_MAX_LENGTH}자
                    </Text>
                  </Counter>
                </InformRow>
              )}
              {readOnly ? null : (
                // 최대 글자 수에 도달해 이후 입력이 무시되기 시작하는 시점을
                // 알린다(InputFieldShell 패리티). 도달/해제 시에만 내용이
                // 바뀌므로 타이핑마다 반복 낭독되지 않는다.
                <HiddenText role="status">
                  {titleField.value.length >=
                  ADDITIONAL_QUESTION_TITLE_MAX_LENGTH
                    ? `최대 ${ADDITIONAL_QUESTION_TITLE_MAX_LENGTH}자에 도달했어요`
                    : ""}
                </HiddenText>
              )}
            </QuestionTitleField>
          );
        }}
      />

      {questionType === "SELECT" ? (
        <AdditionalSelectOptionFields
          form={form}
          questionIndex={questionIndex}
          readOnly={readOnly}
        />
      ) : null}
    </QuestionCard>
  );
};

const QuestionCard = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.md,
  padding: theme.spacing.xl,
  borderRadius: theme.pxToRem(20),
  background: theme.color.bg.subtle,
}));

const QuestionCardHeader = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing.md,
}));

const QuestionTitleField = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.md,
}));

const QuestionTitleInput = styled.input<{
  $hasError: boolean;
  $readOnly: boolean;
}>(({ $hasError, $readOnly, theme }) => ({
  ...theme.typography["body-m-m"],
  width: "100%",
  minWidth: 0,
  minHeight: theme.pxToRem(51),
  padding: theme.spacing.xl,
  border: `${$hasError ? theme.pxToRem(2) : theme.pxToRem(1)} solid ${
    $hasError ? theme.color.border.danger : theme.color.border.default
  }`,
  borderRadius: theme.radius.md,
  boxSizing: "border-box",
  backgroundColor: $readOnly ? theme.color.bg.surface : theme.color.bg.default,
  color: $readOnly ? theme.color.text.tertiary : theme.color.text.primary,
  outline: 0,
  transition: "border-color 140ms ease-out, border-width 140ms ease-out",

  "&::placeholder": {
    color: theme.color.text.tertiary,
  },

  "&:focus": {
    borderWidth: $readOnly ? theme.pxToRem(1) : theme.pxToRem(2),
    borderColor: $readOnly
      ? theme.color.border.default
      : $hasError
        ? theme.color.border.danger
        : theme.color.border.brand,
  },

  "&:read-only": {
    backgroundColor: theme.color.bg.surface,
    color: theme.color.text.tertiary,
    cursor: "default",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}));

const InformRow = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  minHeight: theme.pxToRem(21),
  gap: theme.spacing.md,
}));

const FieldError = styled.p(({ theme }) => ({
  ...theme.typography["body-s-m"],
  minWidth: 0,
  margin: 0,
  color: theme.color.text.danger,
}));

const Counter = styled.span(({ theme }) => ({
  display: "inline-flex",
  flexShrink: 0,
  alignItems: "center",
  gap: theme.spacing.xs,
}));
