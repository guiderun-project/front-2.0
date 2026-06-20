import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Button, Text } from '@/components';

// TODO: API 연동 시 props로 대체
const RUNNING_INFO = {
  group: 'E 기록이 없는 시각장애 러너',
  personalRecord: '46:44(10km)',
  hope: '줄글줄글',
} as const;

type RunningInfoSectionProps = {
  onEdit?: () => void;
};

export const RunningInfoSection = ({ onEdit }: RunningInfoSectionProps): ReactElement => {
  return (
    <Card aria-label="러닝 정보">
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          러닝 그룹
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {RUNNING_INFO.group}
        </Text>
      </Row>
      <Row $align="flex-start">
        <RowLabel color="text.secondary" font="body-m-sb">
          개인 기록
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {RUNNING_INFO.personalRecord}
        </Text>
      </Row>
      <Row $align="flex-start">
        <RowLabel color="text.secondary" font="body-m-sb">
          희망사항
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {RUNNING_INFO.hope}
        </Text>
      </Row>
      <Button fullWidth level="quaternary" onClick={onEdit}>
        러닝 정보 수정
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

const Row = styled.div<{ $align?: 'center' | 'flex-start' }>(({ $align = 'center', theme }) => ({
  display: 'flex',
  alignItems: $align,
  gap: theme.spacing['2xl'],
  width: '100%',
}));

const RowLabel = styled(Text)(({ theme }) => ({
  flexShrink: 0,
  width: theme.pxToRem(80),
}));
