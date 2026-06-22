import type { ReactElement } from 'react';

import type { UserType } from '@/api/types';
import { RUNNER_TYPE_LABELS } from '@/constants';

import GuideAvatar from './assets/guide.svg?react';
import ViAvatar from './assets/vi.svg?react';

const RUNNER_TYPE_AVATAR_SIZE_PX = {
  s: 18,
  m: 24,
  xl: 72,
} as const;

const RUNNER_TYPE_AVATAR_GRAPHIC = {
  VI: ViAvatar,
  GUIDE: GuideAvatar,
} as const;

type RunnerTypeAvatarSize = keyof typeof RUNNER_TYPE_AVATAR_SIZE_PX;

type RunnerTypeAvatarProps = {
  type: UserType;
  size?: RunnerTypeAvatarSize;
};

export const RunnerTypeAvatar = ({
  size = 'm',
  type,
}: RunnerTypeAvatarProps): ReactElement => {
  const AvatarGraphic = RUNNER_TYPE_AVATAR_GRAPHIC[type];
  const avatarSize = RUNNER_TYPE_AVATAR_SIZE_PX[size];

  return (
    <AvatarGraphic
      aria-label={RUNNER_TYPE_LABELS[type]}
      focusable="false"
      height={avatarSize}
      role="img"
      style={{
        display: 'inline-block',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      width={avatarSize}
    />
  );
};
