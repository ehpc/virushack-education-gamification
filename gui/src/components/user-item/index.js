import React, { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

import FunnyIcon from '../funny-icon';

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
    id, name, avatar, status, perks,
  } = user;

  return (
    <ListItem key={id} button>
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
              perks.length
                && (
                  <Typography
                    className={`${classes.secondary} ${classes.perksList}`}
                    variant="caption"
                  >
                    {perks.map(({ icon, id: perkId }) => (
                      <FunnyIcon
                        key={perkId}
                        className={classes.perkIcon}
                        src={`perks/${icon}`}
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
            {status || <>&nbsp;</>}
          </Typography>
      )}
      />
    </ListItem>
  );
});
