import type { ReactElement } from "react";

import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

import {
  FooterButton,
  FormPageLayout,
  Icon,
  PageLayout,
  Text,
  Textarea,
} from "@/components";
import { APP_PATH } from "@/router/path";

import {
  WITHDRAWAL_CUSTOM_REASON_MAX_LENGTH,
  WITHDRAWAL_REASON_OPTIONS,
} from "./constants";
import { useAccountDelete } from "./hooks/useAccountDelete";

export const AccountDeletePage = (): ReactElement => {
  const navigate = useNavigate();
  const {
    selectedReason,
    selectReason,
    customReason,
    setCustomReason,
    isCustomSelected,
    canSubmit,
    isSubmitting,
    submit,
  } = useAccountDelete();

  const handleSubmit = async () => {
    const isSucceeded = await submit();

    if (isSucceeded) {
      navigate(APP_PATH.INTRO, { replace: true });
    }
  };

  return (
    <PageLayout background="bg.default">
      <FormPageLayout
        title={"가이드런 프로젝트를\n떠나는 이유를 알려주세요"}
        topNavigation={{
          left: {
            icon: "chevron-left-lined",
            ariaLabel: "뒤로가기",
            onClick: () => navigate(-1),
          },
          right: [
            {
              icon: "close-lined",
              ariaLabel: "닫기",
              onClick: () => navigate(APP_PATH.MY),
            },
          ],
        }}
      >
        <Content>
          <ReasonList aria-label="탈퇴 사유" role="radiogroup">
            {WITHDRAWAL_REASON_OPTIONS.map((reason) => {
              const isSelected = selectedReason === reason;

              return (
                <ReasonOption
                  key={reason}
                  $selected={isSelected}
                  aria-checked={isSelected}
                  role="radio"
                  type="button"
                  onClick={() => selectReason(reason)}
                >
                  {isSelected ? (
                    <Icon
                      aria-hidden={true}
                      color="icon.brand"
                      icon="check-lined"
                      size={14}
                    />
                  ) : null}
                  <Text
                    color={isSelected ? "text.brand" : "text.secondary"}
                    font="body-l-sb"
                  >
                    {reason}
                  </Text>
                </ReasonOption>
              );
            })}
          </ReasonList>

          {isCustomSelected ? (
            <Textarea
              label="기타 사유"
              maxLength={WITHDRAWAL_CUSTOM_REASON_MAX_LENGTH}
              value={customReason}
              onChange={(event) => setCustomReason(event.target.value)}
            />
          ) : null}

          <NoticeBox>
            <Text as="p" color="text.secondary" font="body-s-sb">
              탈퇴 전, 꼭 확인해주세요
            </Text>
            <Text as="p" color="text.tertiary" font="body-s-m">
              가이드런 프로젝트를 탈퇴 할 경우, 가이드런과 함께 쌓아온 기록들이
              모두 사라집니다.
            </Text>
          </NoticeBox>
        </Content>

        <FooterButton>
          <FooterButton.Button
            aria-busy={isSubmitting}
            disabled={!canSubmit}
            fullWidth
            size="l"
            onClick={handleSubmit}
          >
            탈퇴하기
          </FooterButton.Button>
        </FooterButton>
      </FormPageLayout>
    </PageLayout>
  );
};

const Content = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  paddingTop: theme.spacing["2xl"],
  paddingInline: theme.spacing["2xl"],
}));

const ReasonList = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
}));

const ReasonOption = styled.button<{ $selected: boolean }>(
  ({ $selected, theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.s,
    width: "100%",
    height: theme.pxToRem(54),
    padding: `0 ${theme.spacing.xl}`,
    borderRadius: theme.radius.md,
    border: $selected
      ? `2px solid ${theme.color.border.brand}`
      : `1.8px solid ${theme.color.border.default}`,
    backgroundColor: "transparent",
    cursor: "pointer",
    touchAction: "manipulation",

    "&:focus-visible": {
      outline: `2px solid ${theme.color.border.focused}`,
      outlineOffset: theme.spacing.xs,
    },
  }),
);

const NoticeBox = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.md,
  marginTop: theme.spacing.lg,
  padding: theme.spacing.xl,
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.subtle,

  p: {
    margin: 0,
  },
}));
