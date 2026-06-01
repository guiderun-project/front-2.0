import type { ReactNode } from 'react';

type BottomSheetAccessibleName = Exclude<ReactNode, boolean | null | undefined>;

export type BottomSheetHeading = {
  title: BottomSheetAccessibleName;
  subtitle?: ReactNode;
  description?: ReactNode;
};
