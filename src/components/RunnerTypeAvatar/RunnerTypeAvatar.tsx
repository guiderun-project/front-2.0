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
  /**
   * 인접 텍스트가 러너 유형을 이미 안내해 중복 낭독이 되는 경우 true로
   * 지정하면 스크린리더에서 숨겨진다. 기본값은 러너 유형을 낭독하는
   * 정보성 이미지다.
   */
  'aria-hidden'?: boolean;
};

export const RunnerTypeAvatar = ({
  'aria-hidden': ariaHidden = false,
  size = 'm',
  type,
}: RunnerTypeAvatarProps): ReactElement => {
  const AvatarGraphic = RUNNER_TYPE_AVATAR_GRAPHIC[type];
  const avatarSize = RUNNER_TYPE_AVATAR_SIZE_PX[size];

  return (
    <AvatarGraphic
      aria-hidden={ariaHidden || undefined}
      aria-label={ariaHidden ? undefined : RUNNER_TYPE_LABELS[type]}
      focusable="false"
      height={avatarSize}
      role={ariaHidden ? undefined : 'img'}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      width={avatarSize}
    />
  );
};
