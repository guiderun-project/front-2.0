type AttendanceFocusStatus = 'waiting' | 'attended';

export type AttendanceFocusTarget = {
  status: AttendanceFocusStatus;
  userId: string | null;
};

const getActionButtons = (status: AttendanceFocusStatus): HTMLElement[] => {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      `[data-attendance-action="${status}"]`,
    ),
  );
};

/**
 * 출석/출석취소 처리로 카드가 다른 섹션으로 이동하기 전에, 처리 후 포커스를
 * 복구할 다음 목적지(같은 목록의 다음 참가자, 없으면 이전 참가자)를 기억한다.
 */
export const captureNextActionFocusTarget = (
  status: AttendanceFocusStatus,
  userId: string,
): AttendanceFocusTarget => {
  const buttons = getActionButtons(status);
  const currentIndex = buttons.findIndex(
    (button) => button.dataset.userId === userId,
  );

  if (currentIndex === -1) {
    return { status, userId: null };
  }

  const nextButton = buttons[currentIndex + 1] ?? buttons[currentIndex - 1];

  return { status, userId: nextButton?.dataset.userId ?? null };
};

/**
 * 기억해 둔 목적지의 액션 버튼으로 포커스를 되돌린다. 대상 버튼이 사라졌거나
 * 목록이 비었으면 해당 섹션 제목으로 이동해 스크린리더 읽기 위치를 유지한다.
 */
export const focusAttendanceTarget = (target: AttendanceFocusTarget): void => {
  if (target.userId !== null) {
    const button = document.querySelector<HTMLElement>(
      `[data-attendance-action="${target.status}"][data-user-id="${CSS.escape(target.userId)}"]`,
    );

    if (button) {
      button.focus({ preventScroll: true });
      return;
    }
  }

  const heading = document.querySelector<HTMLElement>(
    `[data-attendance-section="${target.status}"]`,
  );

  heading?.focus({ preventScroll: true });
};
