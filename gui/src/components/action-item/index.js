import React, { memo, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import format from 'date-fns/format';
import { makeStyles } from '@material-ui/core/styles';

import ActionDial from '../action-dial';
import FunnyIcon from '../funny-icon';
import { getActionData } from '../../models/action-types';
import dbModel from '../../models/db';

const useStyles = makeStyles((theme) => ({
  secondary: {
    color: theme.palette.text.secondary,
  },
  timestamp: {
    textAlign: 'right',
  },
  priorityred: {
    color: theme.palette.error.main,
  },
  prioritygreen: {
    color: theme.palette.success.main,
  },
  prioritydefault: {
    color: theme.palette.text.secondary,
  },
  actionIcon: {
    verticalAlign: 'middle',
    marginLeft: theme.spacing(1),
  },
}));


/**
 * Форматирует время сообщения
 * @param {number} timestamp Метка времени
 */
function formatTimestamp(timestamp) {
  return format(timestamp, 'HH:mm:ss');
}

export default memo(({ action }) => {
  const classes = useStyles();
  const { user, timestamp, name } = action;
  const actionData = getActionData(name);

  const [menuOpen, setMenuOpen] = useState(false);

  function handleItemClick() {
    if (dbModel.currentUserIsTeacher()) {
      setMenuOpen((prevMenuOpen) => !prevMenuOpen);
    }
  }

  function handleMenuClose() {
    setMenuOpen(false);
  }

  return (
    <Grow in timeout={500}>
      <>
        <ListItem button onClick={handleItemClick}>
          <ListItemAvatar>
            <Avatar alt={user.name} src={user.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={(
              <Grid container>
                <Grid item xs={7}>
                  <Typography variant="subtitle2">{user.name}</Typography>
                </Grid>
                <Grid className={classes.timestamp} item xs={5}>
                  <Typography
                    className={classes.secondary}
                    variant="caption"
                  >
                    {formatTimestamp(timestamp)}
                  </Typography>
                </Grid>
              </Grid>
          )}
            secondary={(
              <Typography className={classes[`priority${actionData.priority}`]} variant="body2">
                {actionData.text}
                {
              actionData.icon
                && (
                  <FunnyIcon
                    className={classes.actionIcon}
                    alt={actionData.text}
                    src={`actions/${actionData.icon}`}
                    size="xxs"
                  />
                )
              }
              </Typography>
          )}
          />
        </ListItem>
        <ActionDial user={user} open={menuOpen} onClose={handleMenuClose} />
      </>
    </Grow>
  );
});
