import type { ReactNode } from 'react';

export type InputFieldOwnProps = {
  label: string;
  helperText?: ReactNode;
  errorText?: ReactNode;
  maxLength?: number;
};
