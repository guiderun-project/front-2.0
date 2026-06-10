import type { ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

type AttendanceLiveRegionProps = {
  children: ReactNode;
};

export const AttendanceLiveRegion = ({
  children,
}: AttendanceLiveRegionProps): ReactElement => {
  return (
    <LiveRegion aria-live="polite" role="status">
      {children}
    </LiveRegion>
  );
};

const LiveRegion = styled.span({
  // Fixed values follow the standard visually-hidden accessibility pattern.
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});
