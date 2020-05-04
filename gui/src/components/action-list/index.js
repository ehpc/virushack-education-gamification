import React, { memo } from 'react';
import List from '@material-ui/core/List';

import ActionItem from '../action-item';
import dbModel from '../../models/db';

export default memo(({ actions = [] }) => {
  const user = dbModel.getCurrentUser();
  return (
    <List>
      {
        actions
          .filter((action) => user.teacher || action.hidden !== true || action.user.id === user.id)
          .map((action) => (
            <ActionItem key={action.id} action={action} />
          ))
      }
    </List>
  );
});
