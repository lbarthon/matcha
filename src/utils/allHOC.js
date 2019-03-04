import React from 'react';
import { withCurrentUserHOC } from './currentUser';
import { withLocalesHOC } from './locales';
import { withSocketHOC } from './socket';

export const withAllHOC = (Component) => {
  return withCurrentUserHOC(withLocalesHOC(withSocketHOC(Component)));
}
