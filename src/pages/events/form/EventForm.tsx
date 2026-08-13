import { useId, type KeyboardEvent, type ReactElement } from "react";

import styled from "@emotion/styled";
import { Controller, type UseFormReturn } from "react-hook-form";

import type { EventType } from "@/api/types";
import {
  CheckBox,
  ConfirmPopup,
  DateInput,
  FooterButton,
  FormPageLayout,
  HiddenText,
  Input,
  Select,
  Text,
  Textarea,
} from "@/components";

import { AdditionalQuestionEditor } from "./components/AdditionalQuestionEditor";
import { MaskedTimeInput } from "./components/MaskedTimeInput";
import { RunningDistanceInput } from "./components/RunningDistanceInput";
import {
  EVENT_CONTENT_MAX_LENGTH,
  EVENT_FORM_MODES,
  EVENT_FORM_TITLES,
  TRAINING_OPERATION_OPTIONS,
  type EventFormMode,
  type TrainingOperationType,
} from "./constants";
import type { EventFormValues } from "./schema";

type EventFormProps = {
  eventType: EventType;
  form: UseFormReturn<EventFormValues>;
  mode: EventFormMode;
  isSubmitting: boolean;
  confirmOpen: boolean;
  onBack: () => void;
  onCancelBack: () => void;
  onConfirmBack: () => void;
  onSubmit: (values: EventFormValues) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  submitDisabled?: boolean;
  /**
   * 모임 일시로 고를 수 있는 가장 이른 날짜(YYYY-MM-DD).
   * date picker 에서 이전 날짜를 아예 못 고르게 막는 용도로, 스키마 검증과 같은 값을 쓴다.
   */
  minEventDate?: string;
};

export const EventForm = ({
  confirmOpen,
  eventType,
  form,
  isDeleting = false,
  isSubmitting,
  mode,
  onBack,
  onCancelBack,
  onConfirmBack,
  onDelete,
  onSubmit,
  submitDisabled = false,
  minEventDate,
}: EventFormProps): ReactElement => {
  const privateHelperId = useId();
  const timeFormatHintId = useId();
  const submitBlockedHintId = useId();
  const recruitStartDate = form.watch("recruitStartDate");
  const resolvedSubmitLabel =
    mode === EVENT_FORM_MODES.EDIT ? "수정완료" : "모임 만들기";
  const resolvedSecondaryAction = onDelete
    ? {
        label: "삭제하기",
        onClick: onDelete,
        disabled: isDeleting || isSubmitting,
      }
    : undefined;

  // 단일 라인 입력에서 Enter 로 폼이 암묵적으로 제출되는 것을 막는다.
  // IME 조합 중에는 무시하고, textarea 줄바꿈과 버튼 동작은 그대로 둔다.
  const handleFormKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
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
    <>
      <FormPageLayout
        title={EVENT_FORM_TITLES[eventType]}
        topNavigation={{
          left: {
            ariaLabel: "이전 화면으로 이동",
            icon: "chevron-left-lined",
            onClick: onBack,
          },
        }}
      >
        <Form
          noValidate
          onKeyDown={handleFormKeyDown}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormSection>
            <SectionHeader>
              <Text as="h2" color="text.secondary" font="body-m-sb">
                기본 정보
              </Text>
            </SectionHeader>
            <FieldStack>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Input
                    aria-required={true}
                    controlRef={field.ref}
                    errorText={fieldState.error?.message}
                    label="모임 제목"
                    placeholder="모임 제목"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />

              {eventType === "TRAINING" ? (
                <Controller
                  control={form.control}
                  name="operationType"
                  render={({ field, fieldState }) => (
                    <Select<TrainingOperationType>
                      ariaLabel="모임 운영방식"
                      errorText={fieldState.error?.message}
                      label="모임 운영방식"
                      options={TRAINING_OPERATION_OPTIONS}
                      placeholder="모임 운영방식"
                      required
                      sheetTitle="모임 운영방식"
                      triggerRef={field.ref}
                      value={
                        field.value === "GENERAL" || field.value === "GROUP"
                          ? field.value
                          : undefined
                      }
                      onChange={field.onChange}
                    />
                  )}
                />
              ) : null}

              <Controller
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <Textarea
                    controlRef={field.ref}
                    errorText={fieldState.error?.message}
                    label="모임 상세 내용(선택)"
                    maxLength={EVENT_CONTENT_MAX_LENGTH}
                    placeholder="모임 상세 내용을 입력해주세요."
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <PrivateField>
                    <PrivateLabel>
                      <CheckBox
                        aria-describedby={privateHelperId}
                        checked={field.value}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                      />
                      <Text color="text.primary" font="body-l-m">
                        비공개 모임
                      </Text>
                    </PrivateLabel>
                    <PrivateHelper
                      color="text.tertiary"
                      font="body-s-m"
                      id={privateHelperId}
                    >
                      {
                        "비공개 모임는 전체 목록에서는 보이지 않고,\n특정 링크를 통해서만 접근할 수 있어요."
                      }
                    </PrivateHelper>
                  </PrivateField>
                )}
              />
            </FieldStack>
          </FormSection>

          <Divider aria-hidden="true" />

          <FormSection>
            <SectionHeader>
              <Text as="h2" color="text.secondary" font="body-m-sb">
                모임 일정
              </Text>
            </SectionHeader>
            <FieldStack>
              <Controller
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <DateInput
                    aria-required={true}
                    controlRef={field.ref}
                    errorText={fieldState.error?.message}
                    label="모임 일시"
                    min={minEventDate}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
              <TimeFields>
                <TwoColumnFields>
                  <Controller
                    control={form.control}
                    name="startTime"
                    render={({ field, fieldState }) => (
                      <MaskedTimeInput
                        aria-required={true}
                        controlRef={field.ref}
                        describedById={timeFormatHintId}
                        errorText={fieldState.error?.message}
                        label="시작 시간"
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="endTime"
                    render={({ field, fieldState }) => (
                      <MaskedTimeInput
                        aria-required={true}
                        controlRef={field.ref}
                        describedById={timeFormatHintId}
                        errorText={fieldState.error?.message}
                        label="종료 시간"
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TwoColumnFields>
                {/* 두 시간 필드가 함께 쓰는 형식 안내. 필드별 helperText 로 두면
                    반폭에서 줄바꿈이 심해지고 문장이 중복되며, 오류가 나는 순간
                    errorText 에 밀려 사라지므로 행 아래 한 줄로 상시 노출한다. */}
                <Text
                  color="text.tertiary"
                  font="body-s-m"
                  id={timeFormatHintId}
                >
                  시간은 24시간 기준으로 입력해주세요.
                </Text>
              </TimeFields>
              <Controller
                control={form.control}
                name="place"
                render={({ field, fieldState }) => (
                  <Input
                    aria-required={true}
                    controlRef={field.ref}
                    errorText={fieldState.error?.message}
                    label="만나는 장소"
                    placeholder="만나는 장소"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="expectedRunningDistanceKm"
                render={({ field, fieldState }) => (
                  <RunningDistanceInput
                    controlRef={field.ref}
                    errorText={fieldState.error?.message}
                    label="예상 러닝거리 (선택)"
                    placeholder="0"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldStack>
          </FormSection>

          <Divider aria-hidden="true" />

          <FormSection>
            <SectionHeader>
              <Text as="h2" color="text.secondary" font="body-m-sb">
                모집 일정
              </Text>
            </SectionHeader>
            <TwoColumnFields>
              <Controller
                control={form.control}
                name="recruitStartDate"
                render={({ field, fieldState }) => (
                  <DateInput
                    aria-required={true}
                    controlRef={field.ref}
                    errorText={fieldState.error?.message}
                    label="모집 시작일"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="recruitEndDate"
                render={({ field, fieldState }) => (
                  <DateInput
                    aria-required={true}
                    controlRef={field.ref}
                    errorText={fieldState.error?.message}
                    label="모집 마감일"
                    min={recruitStartDate || undefined}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
            </TwoColumnFields>
          </FormSection>

          <Divider aria-hidden="true" />

          <FormSection>
            <SectionHeader>
              <Text as="h2" color="text.secondary" font="body-m-sb">
                추가 정보 (선택)
              </Text>
            </SectionHeader>
            <AdditionalQuestionEditor
              form={form}
              readOnly={mode === EVENT_FORM_MODES.EDIT}
            />
          </FormSection>

          <FooterButton ratio={resolvedSecondaryAction ? "35:65" : undefined}>
            {resolvedSecondaryAction ? (
              <FooterButton.Button
                disabled={resolvedSecondaryAction.disabled}
                fullWidth
                level="secondary"
                size="l"
                type="button"
                onClick={resolvedSecondaryAction.onClick}
              >
                {resolvedSecondaryAction.label}
              </FooterButton.Button>
            ) : null}
            <FooterButton.Button
              aria-describedby={
                submitDisabled ? submitBlockedHintId : undefined
              }
              disabled={submitDisabled || isSubmitting || isDeleting}
              fullWidth
              size="l"
              type="submit"
            >
              {resolvedSubmitLabel}
            </FooterButton.Button>
          </FooterButton>
          {/* 비활성 사유를 disabled 버튼에서도 낭독되는 aria-describedby 로 전달한다. */}
          {submitDisabled ? (
            <HiddenText id={submitBlockedHintId}>
              입력하지 않았거나 잘못 입력한 항목이 있어 완료할 수 없어요. 위쪽
              입력 항목의 오류를 확인해주세요.
            </HiddenText>
          ) : null}
        </Form>
      </FormPageLayout>

      <ConfirmPopup
        cancelText="아니요"
        confirmText="네, 그만할게요"
        description="지금까지 입력한 정보는 저장되지 않아요."
        open={confirmOpen}
        title={
          mode === EVENT_FORM_MODES.CREATE
            ? "모임 만들기를 그만할까요?"
            : "모임 수정을 그만할까요?"
        }
        onCancel={onCancelBack}
        onConfirm={onConfirmBack}
      />
    </>
  );
};

const Form = styled.form(({ theme }) => ({
  display: "grid",
  paddingTop: theme.spacing["4xl"],
}));

const FormSection = styled.section(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.lg,
  paddingInline: theme.spacing["2xl"],
}));

const SectionHeader = styled.div({
  display: "grid",
});

const FieldStack = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.lg,
  width: "100%",
}));

const TwoColumnFields = styled.div(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: theme.spacing.md,
}));

const TimeFields = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.sm,
}));

const PrivateField = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.sm,
}));

const PrivateLabel = styled.label(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
}));

const PrivateHelper = styled(Text)({
  whiteSpace: "pre-line",
});

const Divider = styled.div(({ theme }) => ({
  height: theme.spacing.lg,
  marginBlock: theme.spacing["2xl"],
  background: theme.color.border.subtle,
}));
