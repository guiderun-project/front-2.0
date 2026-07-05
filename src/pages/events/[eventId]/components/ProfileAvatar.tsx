import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { UserType } from '@/api/types';
import { HiddenText, RunnerTypeAvatar, Text } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

type ProfileAvatarProps = {
  name: string;
  type: UserType;
};

export const ProfileAvatar = ({
  name,
  type,
}: ProfileAvatarProps): ReactElement => {
  return (
    <AvatarWrap>
      <HiddenText>{`${RUNNER_TYPE_LABELS[type]} ${name}`}</HiddenText>
      <AvatarVisual aria-hidden={true}>
        <RunnerTypeAvatar
          size="m"
          type={type}
        />
        <Text color="text.primary" font="body-m-sb">
          {name}
        </Text>
      </AvatarVisual>
    </AvatarWrap>
  );
};

const AvatarWrap = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const AvatarVisual = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
}));
