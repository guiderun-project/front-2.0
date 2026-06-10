import styled from "@emotion/styled";

export const HomeSectionMessage = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing.md,
  minHeight: theme.pxToRem(96),
  padding: theme.spacing.lg,
  color: theme.color.text.tertiary,
  textAlign: "center",
  ...theme.typography["body-m-m"],
}));
