import React from 'react';
import { withCurrentUserHOC } from './currentUser';
import { withLocalesHOC } from './locales';
import { withSocketHOC } from './socket';
import { withNotificationsHOC } from './notifications';

export const withAllHOC = (Component) => {
  return withCurrentUserHOC(withLocalesHOC(withSocketHOC(withNotificationsHOC(Component))));
}
