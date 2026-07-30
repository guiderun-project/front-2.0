import { APP_PATH } from '@/router/path';

export const MY_EDIT_INFO_PARAM = 'info';

export const MY_EDIT_INFO = {
  PROFILE: 'profile',
  RUNNING: 'running',
} as const;

/** 러닝 정보 수정 화면으로 이동하는 경로 (쿼리 파라미터 포함) */
export const MY_RUNNING_EDIT_PATH = `${APP_PATH.MY_EDIT}?${MY_EDIT_INFO_PARAM}=${MY_EDIT_INFO.RUNNING}`;
