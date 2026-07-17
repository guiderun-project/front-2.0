import type { ReactElement } from "react";

import styled from "@emotion/styled";

import { HiddenText } from "@/components/HiddenText";

import type { InputRequirement } from "./Input.types";

const REQUIREMENT_TEXT: Record<InputRequirement, string> = {
  required: "필수",
  optional: "선택",
};

const REQUIRED_DOT_SIZE = 3;
const REQUIRED_DOT_GAP = 2;

type FieldLabelContentProps = {
  label: string;
  requirement?: InputRequirement;
};

/**
 * 라벨 앞에 필수/선택을 숨김 텍스트로 두어 스크린리더가 라벨보다 먼저 읽게 하고,
 * 필수일 때만 라벨 오른쪽에 빨간 점을 표시한다. 점은 장식이라 스크린리더에서 숨긴다.
 */
export const FieldLabelContent = ({
  label,
  requirement,
}: FieldLabelContentProps): ReactElement => {
  return (
    <>
      {requirement && <HiddenText>{REQUIREMENT_TEXT[requirement]}</HiddenText>}
      {label}
      {requirement === "required" && <RequiredDot aria-hidden="true" />}
    </>
  );
};

const RequiredDot = styled.span(({ theme }) => ({
  display: "inline-block",
  width: theme.pxToRem(REQUIRED_DOT_SIZE),
  height: theme.pxToRem(REQUIRED_DOT_SIZE),
  marginLeft: theme.pxToRem(REQUIRED_DOT_GAP),
  borderRadius: theme.radius.full,
  // 점 전용 bg 토큰이 없어 시맨틱 danger 색을 사용한다. (라이트/다크 모두 대응)
  backgroundColor: theme.color.text.danger,
  verticalAlign: "top",
}));
