import React from 'react';
import { withCurrentUserHOC } from './currentUser';
import { withLocalesHOC } from './locales';

export const withAllHOC(Component) = (Component) => {
  return withCurrentUserHOC(withLocalesHOC(Component));
}
