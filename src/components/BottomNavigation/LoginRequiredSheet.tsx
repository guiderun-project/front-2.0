import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { BottomSheet } from '../BottomSheet';
import { ButtonGroup } from '../Button';

type LoginRequiredSheetProps = {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
};

/**
 * 비로그인 사용자가 로그인 필요한 메뉴(마이페이지 등)를 누를 때 노출하는 로그인 안내 시트.
 */
export const LoginRequiredSheet = ({
  onClose,
  onLogin,
  open,
}: LoginRequiredSheetProps): ReactElement => {
  return (
    <BottomSheet
      heading={{
        title: '지금 로그인하고 계속할까요?',
        description: '이 기능은 로그인 후 이용할 수 있어요.',
      }}
      open={open}
      onClose={onClose}
      footer={
        <SheetButtonGroup ratio="35:65">
          <ButtonGroup.Button level="secondary" size="l" onClick={onClose}>
            아니요
          </ButtonGroup.Button>
          <ButtonGroup.Button size="l" onClick={onLogin}>
            로그인하기
          </ButtonGroup.Button>
        </SheetButtonGroup>
      }
    />
  );
};

// BottomSheet Footer가 이미 좌우 패딩을 주므로 ButtonGroup 자체 패딩은 제거한다.
const SheetButtonGroup = styled(ButtonGroup)({
  paddingInline: 0,
});
