import React, { memo } from 'react';
import List from '@material-ui/core/List';

import ActionItem from '../action-item';

export default memo(({ actions = [] }) => (
  <List>
    {actions.map((action) => (
      <ActionItem key={action.id} action={action} />
    ))}
  </List>
));
