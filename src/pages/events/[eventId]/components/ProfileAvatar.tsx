import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { UserType } from '@/api/types';
import { RunnerTypeAvatar, Text } from '@/components';

type ProfileAvatarProps = {
  name: string;
  type: UserType;
};

export const ProfileAvatar = ({
  name,
  type,
}: ProfileAvatarProps): ReactElement => {
  const avatarType = type === 'VI' ? 'vi' : 'guide';

  return (
    <AvatarWrap>
      <RunnerTypeAvatar size="m" type={avatarType} />
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
