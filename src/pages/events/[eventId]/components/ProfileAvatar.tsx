import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { UserType } from '@/api/types';
import { RunnerTypeAvatar, Text } from '@/components';
import { RUNNER_TYPE_AVATAR_TYPE_BY_USER_TYPE } from '@/constants';

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
      <RunnerTypeAvatar
        size="m"
        type={RUNNER_TYPE_AVATAR_TYPE_BY_USER_TYPE[type]}
      />
      <Text color="text.primary" font="body-m-sb">
        {name}
      </Text>
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
