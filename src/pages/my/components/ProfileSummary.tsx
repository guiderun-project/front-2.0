import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MyPageResponse } from '@/api/types';
import { HiddenText, RunnerTypeAvatar, Text } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

const GENDER_LABEL = { FEMALE: '여성', MALE: '남성' } as const;

type ProfileSummaryProps = {
  profile: MyPageResponse['profile'];
};

export const ProfileSummary = ({ profile }: ProfileSummaryProps): ReactElement => {
  const { name, gender, type, recordDegree } = profile;
  const meta = `${GENDER_LABEL[gender]}・${RUNNER_TYPE_LABELS[type]}・${recordDegree}그룹`;

  return (
    <Container>
      {/* 러너 유형은 아래 메타 텍스트가 안내하므로 아바타는 장식 처리해 중복 낭독을 막는다. */}
      <RunnerTypeAvatar aria-hidden={true} size="xl" type={type} />
      <NameGroup>
        <Text as="h2" align="center" color="text.primary" font="heading-m-b">
          {name}
        </Text>
        {/* '・'(U+30FB) 구분자는 스크린리더에서 어색하게 낭독되므로 쉼표로 풀어 읽는다. */}
        <Text aria-hidden={true} align="center" color="text.tertiary" font="body-m-m">
          {meta}
        </Text>
        <HiddenText>
          {`${GENDER_LABEL[gender]}, ${RUNNER_TYPE_LABELS[type]}, ${recordDegree}그룹`}
        </HiddenText>
      </NameGroup>
    </Container>
  );
};

const Container = styled.section(({ theme }) => ({
  display: 'flex',
  padding: `0 ${theme.spacing['4xl']} ${theme.spacing['2xl']}`,
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.lg,
  width: '100%',
}));

const NameGroup = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.md,
  width: '100%',
}));
