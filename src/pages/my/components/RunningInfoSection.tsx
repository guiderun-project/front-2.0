import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MyPageResponse } from '@/api/types';
import { Button, HiddenText, Text } from '@/components';
import { formatTimeRecordSrLabel } from '@/utils';

import {
  EMPTY_INFO_TEXT,
  getRunningGroupLabel,
  getRunningGroupSrLabel,
} from '../constants';
import { HiddenHeading } from './HiddenHeading';

type RunningInfoSectionProps = {
  runningInfo: MyPageResponse['runningInfo'];
  onEdit?: () => void;
};

export const RunningInfoSection = ({
  runningInfo,
  onEdit,
}: RunningInfoSectionProps): ReactElement => {
  const { type, recordDegree, detailRecord, hopePrefs } = runningInfo;
  // "00:52:30" 형식이 아니면(자유 형식 기록) 시각 텍스트를 그대로 읽는다.
  const detailRecordSrLabel = detailRecord
    ? formatTimeRecordSrLabel(detailRecord)
    : null;

  return (
    <Card aria-label="러닝 정보">
      <HiddenHeading>러닝 정보</HiddenHeading>
      <Row>
        <RowLabel color="text.secondary" font="body-m-sb">
          러닝 그룹
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {/* "A ~50분"의 물결표는 낭독에서 생략되므로 "A 50분 이하"로 풀어 읽는다. */}
          <HiddenText>{getRunningGroupSrLabel(recordDegree, type)}</HiddenText>
          <span aria-hidden={true}>{getRunningGroupLabel(recordDegree, type)}</span>
        </Text>
      </Row>
      <Row $align="flex-start">
        <RowLabel color="text.secondary" font="body-m-sb">
          개인 기록
        </RowLabel>
        <Text color="text.primary" font="body-m-m">
          {detailRecord && detailRecordSrLabel !== detailRecord ? (
            <>
              {/* "00:52:30"은 시/분/초 구분 없이 낭독되므로 "52분 30초"로 읽는다. */}
              <HiddenText>{detailRecordSrLabel}</HiddenText>
              <span aria-hidden={true}>{detailRecord}</span>
            </>
          ) : (
            (detailRecord ?? EMPTY_INFO_TEXT)
          )}
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
