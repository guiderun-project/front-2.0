import { useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { BottomSheet, Button, CheckBox, Icon, Text } from '@/components';
import { APP_PATH } from '@/router/path';

type TrainingSafetyPermissionSheetProps = {
  open: boolean;
  isSubmitting: boolean;
  onAgree: () => void;
  onClose: () => void;
};

export const TrainingSafetyPermissionSheet = ({
  open,
  isSubmitting,
  onAgree,
  onClose,
}: TrainingSafetyPermissionSheetProps): ReactElement => {
  const [checked, setChecked] = useState(false);
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <BottomSheet
      heading={{
        title: (
          <>
            함께 안전하게 달리기 위해
            <br />
            동의가 필요해요
          </>
        ),
      }}
      open={open}
      footer={
        <Button
          disabled={!checked || isSubmitting}
          fullWidth
          size="l"
          type="button"
          onClick={onAgree}
        >
          동의하고 계속하기
        </Button>
      }
      isBackdropCloseDisabled={isSubmitting}
      isEscapeCloseDisabled={isSubmitting}
      onClose={handleClose}
    >
      <Content>
        <AgreementRow>
          <AgreementLabel>
            <CheckBox
              checked={checked}
              disabled={isSubmitting}
              onChange={(event) => setChecked(event.target.checked)}
            />
            <Text color="text.secondary" font="body-m-m">
              훈련 참여 및 안전 면책 동의 (필수)
            </Text>
          </AgreementLabel>
          <DetailLink
            aria-label="훈련 참여 및 안전 면책 동의 약관 상세 보기 새창 열림"
            href={APP_PATH.TERMS}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon
              aria-hidden={true}
              color="icon.secondary"
              icon="external-link-lined"
              size={20}
            />
          </DetailLink>
        </AgreementRow>
      </Content>
    </BottomSheet>
  );
};

const Content = styled.div(({ theme }) => ({
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['3xl']}`,
}));

const AgreementRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.lg,
  width: '100%',
  paddingLeft: theme.spacing.xl,
}));

const AgreementLabel = styled.label(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  minWidth: 0,
  alignItems: 'center',
  gap: theme.spacing.lg,
  cursor: 'pointer',
}));

const DetailLink = styled.a({
  display: 'inline-flex',
  flexShrink: 0,
  cursor: 'pointer',
});
