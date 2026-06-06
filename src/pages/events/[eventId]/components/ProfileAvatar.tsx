import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { UserType } from '@/api/types';
import { Text } from '@/components';

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
      <AvatarCircle $type={type}>
        <AvatarInitial>{type === 'VI' ? 'V' : 'G'}</AvatarInitial>
      </AvatarCircle>
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

const AvatarCircle = styled.span<{ $type: UserType }>(({ $type, theme }) => ({
  display: 'inline-grid',
  flex: '0 0 auto',
  placeItems: 'center',
  width: theme.pxToRem(24),
  height: theme.pxToRem(24),
  borderRadius: theme.radius.full,
  backgroundColor:
    $type === 'VI' ? theme.color.profile.vi : theme.color.profile.guide,
}));

const AvatarInitial = styled.span(({ theme }) => ({
  color: theme.color.text.inverse,
  fontFamily: theme.fontFamily.base,
  fontSize: theme.pxToRem(14),
  fontWeight: theme.fontWeight.semibold,
  lineHeight: 1,
}));
