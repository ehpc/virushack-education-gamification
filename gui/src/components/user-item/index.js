import React, { memo, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

import FunnyIcon from '../funny-icon';
import ActionDial from '../action-dial';
import { getActionData } from '../../models/action-types';
import dbModel from '../../models/db';

const useStyles = makeStyles((theme) => ({
  secondary: {
    color: theme.palette.text.secondary,
  },
  perksContainer: {
    position: 'relative',
    textAlign: 'right',
  },
  perksList: {
    position: 'absolute',
    display: 'block',
    right: 0,
  },
  perkIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default memo(({ user }) => {
  const classes = useStyles();

  const {
    id, name, avatar, lastStatus, perks,
  } = user;

  const lastStatusData = getActionData(lastStatus && lastStatus.name);

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
    <>
      <ListItem key={id} button onClick={handleItemClick}>
        <ListItemAvatar>
          <Avatar alt={name} src={avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Grid container>
              <Grid item xs={7}>
                <Typography variant="subtitle2">{name}</Typography>
              </Grid>
              <Grid className={classes.perksContainer} item xs={5}>
                {
                perks.length > 0
                && (
                  <Typography
                    className={`${classes.secondary} ${classes.perksList}`}
                    variant="caption"
                  >
                    {perks.map(({ name: perkName, id: perkId }) => (
                      <FunnyIcon
                        key={perkId}
                        className={classes.perkIcon}
                        src={`actions/${perkName}`}
                        size="xxs"
                      />
                    ))}
                  </Typography>
                )
              }
              </Grid>
            </Grid>
        )}
          secondary={(
            <Typography className={classes.secondary} variant="body2">
              {
              lastStatus
                ? lastStatusData.text
                : <>&nbsp;</>
            }
            </Typography>
        )}
        />
      </ListItem>
      <ActionDial user={user} open={menuOpen} onClose={handleMenuClose} />
    </>
  );
});
