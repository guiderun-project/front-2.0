import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MyPageResponse } from '@/api/types';
import { Button, Text } from '@/components';

import { EMPTY_INFO_TEXT, getRunningGroupLabel } from '../constants';

type RunningInfoSectionProps = {
  runningInfo: MyPageResponse['runningInfo'];
  onEdit?: () => void;
};

export const RunningInfoSection = ({
  runningInfo,
  onEdit,
}: RunningInfoSectionProps): ReactElement => {
  const { type, recordDegree, detailRecord, hopePrefs } = runningInfo;

  return (
    <Card aria-label="러닝 정보">
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          러닝 그룹
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {getRunningGroupLabel(recordDegree, type)}
        </Text>
      </Row>
      <Row $align="flex-start">
        <RowLabel color="text.secondary" font="body-m-sb">
          개인 기록
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {detailRecord ?? EMPTY_INFO_TEXT}
        </Text>
      </Row>
      <Row $align="flex-start">
        <RowLabel color="text.secondary" font="body-m-sb">
          희망사항
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {hopePrefs ?? EMPTY_INFO_TEXT}
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
