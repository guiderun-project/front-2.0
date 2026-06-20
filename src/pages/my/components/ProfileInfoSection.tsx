import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Button, Text } from '@/components';

// TODO: API 연동 시 props로 대체
const PROFILE_INFO = {
  birthDate: null,
  phone: '01012341234',
  sns: '없음',
  account1365: 'guiderun1365',
  loginId: '없음',
} as const;

type ProfileInfoSectionProps = {
  onEdit?: () => void;
  onInputBirthDate?: () => void;
};

export const ProfileInfoSection = ({
  onEdit,
  onInputBirthDate,
}: ProfileInfoSectionProps): ReactElement => {
  return (
    <Card aria-label="내 정보">
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          생년월일
        </RowLabel>
        {PROFILE_INFO.birthDate ? (
          <Text color="text.primary" font="body-m-m">
            {PROFILE_INFO.birthDate}
          </Text>
        ) : (
          <BirthDateValue>
            <EmptyValue color="text.quaternary" font="body-m-m">
              정보가 필요해요
            </EmptyValue>
            <Button level="secondary" size="s" onClick={onInputBirthDate}>
              입력하기
            </Button>
          </BirthDateValue>
        )}
      </Row>
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          전화번호
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {PROFILE_INFO.phone}
        </Text>
      </Row>
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          SNS 계정
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {PROFILE_INFO.sns}
        </Text>
      </Row>
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          1365 계정
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {PROFILE_INFO.account1365}
        </Text>
      </Row>
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          아이디
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {PROFILE_INFO.loginId}
        </Text>
      </Row>
      <Button fullWidth level="quaternary" onClick={onEdit}>
        내 정보 수정
      </Button>
    </Card>
  );
};

const Card = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['2xl'],
  width: '100%',
  padding: theme.spacing['2xl'],
  borderRadius: theme.radius.lg,
  backgroundColor: theme.color.bg.elevated,
}));

const Row = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing['2xl'],
  width: '100%',
}));

const RowLabel = styled(Text)(({ theme }) => ({
  flexShrink: 0,
  width: theme.pxToRem(80),
}));

const BirthDateValue = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  alignItems: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const EmptyValue = styled(Text)({
  flex: '1 1 0',
  minWidth: 0,
});
