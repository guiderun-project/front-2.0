import type { ReactElement } from 'react';

import { useSearchParams } from 'react-router-dom';

import { MY_EDIT_INFO, MY_EDIT_INFO_PARAM } from './constants';
import { ProfileEditView } from './ProfileEditView';
import { RunningEditView } from './RunningEditView';

export const MyEditPage = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const isRunningSection =
    searchParams.get(MY_EDIT_INFO_PARAM) === MY_EDIT_INFO.RUNNING;

  return isRunningSection ? <RunningEditView /> : <ProfileEditView />;
};
