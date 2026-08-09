import { useEffect, useId, useRef, type ReactElement } from 'react';

import type { EventDetailResponse } from '@/api/types';
import { ConfirmPopup, FooterButton, HiddenText } from '@/components';

import { useEventDetailCta } from '../hooks/useEventDetailCta';

type EventDetailCtaProps = {
  canAccessProtectedTabs: boolean;
  event: EventDetailResponse;
  isApplyPermissionChecking?: boolean;
  isEventOrganizer: boolean;
  onApply?: () => void;
  onRestrictedAccess: () => void;
};

export const EventDetailCta = ({
  canAccessProtectedTabs,
  event,
  isApplyPermissionChecking,
  isEventOrganizer,
  onApply,
  onRestrictedAccess,
}: EventDetailCtaProps): ReactElement => {
  const {
    cancelApplicationConfirm,
    ctaItems,
    isCancelApplicationPending,
    ratio,
  } = useEventDetailCta({
    canAccessProtectedTabs,
    event,
    isApplyPermissionChecking,
    isEventOrganizer,
    onApply,
    onRestrictedAccess,
  });
  const footerId = useId();
  const hadCancelActionRef = useRef(false);
  // 진행 중 CTA 는 native disabled 로 전환돼 아무 안내 없이 무음이 되므로
  // 상시 마운트된 status 리전으로 진행 상태를 낭독시킨다.
  // 신청 취소 진행 상태는 확인 팝업이 자체 status 리전으로 안내하므로 제외한다.
  const pendingMessage = isApplyPermissionChecking
    ? '신청 가능 여부를 확인하고 있어요.'
    : '';

  // 신청취소 성공 시 CTA 버튼 구성이 통째로 교체되며 포커스가 body 로 떨어지므로,
  // 남아 있는 CTA 영역으로 포커스를 복귀시켜 읽기 위치 초기화를 막는다.
  useEffect(() => {
    const hasCancelAction = ctaItems.some(
      (item) => item.action === 'cancelApplication',
    );
    const hadCancelAction = hadCancelActionRef.current;

    hadCancelActionRef.current = hasCancelAction;

    if (
      !hadCancelAction ||
      hasCancelAction ||
      document.activeElement !== document.body
    ) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(footerId)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [ctaItems, footerId]);

  return (
    <>
      <HiddenText role="status">{pendingMessage}</HiddenText>
      <FooterButton
        background="subtle"
        id={footerId}
        ratio={ratio}
        tabIndex={-1}
      >
        {ctaItems.map((item) =>
          item.action === 'notice' ? (
            <FooterButton.Notice key={`${item.action}-${item.label}`}>
              {item.label}
            </FooterButton.Notice>
          ) : (
            <FooterButton.Button
              key={`${item.action}-${item.label}`}
              disabled={item.disabled}
              level={item.level}
              size="l"
              onClick={item.onClick}
            >
              {item.label}
            </FooterButton.Button>
          ),
        )}
      </FooterButton>
      <ConfirmPopup
        cancelDisabled={isCancelApplicationPending}
        cancelText="아니요"
        confirmLoading={isCancelApplicationPending}
        confirmText="네, 취소할게요"
        open={cancelApplicationConfirm.isOpen}
        title="참여를 취소하시겠어요?"
        onCancel={cancelApplicationConfirm.onCancel}
        onConfirm={cancelApplicationConfirm.onConfirm}
      />
    </>
  );
};
