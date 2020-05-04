import React, { memo } from 'react';
import List from '@material-ui/core/List';

import UserItem from '../user-item';

export default memo(({ users = [] }) => (
  <List>
    {users.map((user) => (
      <UserItem key={user.id} user={user} />
    ))}
  </List>
));
