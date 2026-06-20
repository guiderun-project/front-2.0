import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MyPageResponse } from '@/api/types';
import { Button, Text } from '@/components';

import { EMPTY_INFO_TEXT } from '../constants';

type ProfileInfoSectionProps = {
  personalInfo: MyPageResponse['personalInfo'];
  onEdit?: () => void;
  onInputBirthDate?: () => void;
};

export const ProfileInfoSection = ({
  personalInfo,
  onEdit,
  onInputBirthDate,
}: ProfileInfoSectionProps): ReactElement => {
  const { birthDate, phoneNumber, snsId, id1365, accountId } = personalInfo;

  return (
    <Card aria-label="내 정보">
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          생년월일
        </RowLabel>
        {birthDate ? (
          <Text color="text.primary" font="body-m-m">
            {birthDate.replace(/-/g, '.')}
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
          {phoneNumber ?? EMPTY_INFO_TEXT}
        </Text>
      </Row>
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          SNS 계정
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {snsId ?? EMPTY_INFO_TEXT}
        </Text>
      </Row>
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          1365 계정
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {id1365 ?? EMPTY_INFO_TEXT}
        </Text>
      </Row>
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          아이디
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {accountId ?? EMPTY_INFO_TEXT}
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
