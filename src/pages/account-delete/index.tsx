import type { KeyboardEvent, ReactElement } from "react";
import { useId, useRef, useState } from "react";

import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

import {
  FooterButton,
  FormPageLayout,
  HiddenText,
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
  const noticeTitleId = useId();
  const noticeBodyId = useId();
  const reasonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // 탈퇴 실패 안내 문구. 상시 마운트된 alert 라이브 리전에 주입한다.
  const [submitError, setSubmitError] = useState("");
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
    // 재시도 실패 시 같은 문구도 다시 낭독되도록 제출 시작 시점에 비운다.
    setSubmitError("");

    const isSucceeded = await submit();

    if (isSucceeded) {
      // 라우트 어나운서(App.tsx)가 srAnnouncement를 이동 후 낭독한다.
      navigate(APP_PATH.INTRO, {
        replace: true,
        state: { srAnnouncement: "회원 탈퇴가 완료됐어요." },
      });
      return;
    }

    setSubmitError("탈퇴 처리에 실패했어요. 다시 시도해주세요.");
  };

  // APG 라디오 그룹 패턴: 방향키로 이전/다음 사유로 포커스를 옮기면서 그 사유를 선택한다.
  const handleReasonKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const lastIndex = WITHDRAWAL_REASON_OPTIONS.length - 1;
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = index === lastIndex ? 0 : index + 1;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = index === 0 ? lastIndex : index - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    selectReason(WITHDRAWAL_REASON_OPTIONS[nextIndex]);
    reasonRefs.current[nextIndex]?.focus();
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
        {/* SR 전용 라이브 리전. 빈 상태로 상시 마운트해 두고 텍스트만 바꿔야
            iOS VoiceOver/Android TalkBack이 변경을 안정적으로 낭독한다. */}
        <HiddenText role="status">
          {isCustomSelected
            ? "기타 사유 입력란이 표시됐어요. 사유 입력 후 탈퇴하기 버튼을 누를 수 있어요."
            : ""}
        </HiddenText>
        <HiddenText role="status">
          {isSubmitting ? "탈퇴 처리 중이에요." : ""}
        </HiddenText>
        <HiddenText role="alert">{submitError}</HiddenText>

        <Content>
          <ReasonList aria-label="탈퇴 사유" role="radiogroup">
            {WITHDRAWAL_REASON_OPTIONS.map((reason, index) => {
              const isSelected = selectedReason === reason;
              // roving tabindex: 선택된 사유(없으면 첫 사유)만 탭 순서에 노출한다.
              const isTabStop =
                selectedReason === null ? index === 0 : isSelected;

              return (
                <ReasonOption
                  key={reason}
                  ref={(element) => {
                    reasonRefs.current[index] = element;
                  }}
                  $selected={isSelected}
                  aria-checked={isSelected}
                  role="radio"
                  tabIndex={isTabStop ? 0 : -1}
                  type="button"
                  onClick={() => selectReason(reason)}
                  onKeyDown={(event) => handleReasonKeyDown(event, index)}
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
            <Text
              as="p"
              color="text.secondary"
              font="body-s-sb"
              id={noticeTitleId}
            >
              탈퇴 전, 꼭 확인해주세요
            </Text>
            <Text
              as="p"
              color="text.tertiary"
              font="body-s-m"
              id={noticeBodyId}
            >
              가이드런 프로젝트를 탈퇴 할 경우, 가이드런과 함께 쌓아온 기록들이
              모두 사라집니다.
            </Text>
          </NoticeBox>
        </Content>

        <FooterButton>
          {/* 화면 탐색으로 버튼에 바로 도달해도 경고문이 함께 낭독되도록 연결한다. */}
          <FooterButton.Button
            aria-busy={isSubmitting}
            aria-describedby={`${noticeTitleId} ${noticeBodyId}`}
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
