import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';
import Tooltip from '@material-ui/core/Tooltip';
import dbModel, { notSoSecret } from '../../models/db';

import FunnyIcon from '../funny-icon';

const actions = [
  {
    icon: <FunnyIcon src="teacher-actions/add-coins" size="xxs" />,
    name: '+100',
    handler: (user) => {
      dbModel.updateUserCoins(user.id, notSoSecret, 100);
      dbModel.updateUserState(user.id, 'addcoins');
    },
  },
  {
    icon: <FunnyIcon src="actions/star" size="xxs" />,
    name: 'Молодец',
    handler: (user) => {
      dbModel.updateUserState(user.id, 'star');
      dbModel.updateUserStatus(user.id, notSoSecret, 'star');
    },
  },
  {
    icon: <FunnyIcon src="actions/badge" size="xxs" />,
    name: 'Часто отвечает',
    handler: (user) => {
      dbModel.updateUserState(user.id, 'badge');
      dbModel.updateUserStatus(user.id, notSoSecret, 'badge');
    },
  },
  {
    icon: <FunnyIcon src="actions/bad" size="xxs" />,
    name: 'Совсем не отвечает',
    handler: (user) => {
      dbModel.updateUserState(user.id, 'bad');
      dbModel.updateUserStatus(user.id, notSoSecret, 'bad');
    },
  },
  {
    icon: <FunnyIcon src="teacher-actions/remove-coins" size="xxs" />,
    name: '-100',
    handler: (user) => {
      dbModel.updateUserCoins(user.id, notSoSecret, -100);
      dbModel.updateUserState(user.id, 'removecoins');
    },
  },
];

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(1),
      right: theme.spacing(0),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(1),
      left: theme.spacing(0),
    },
  },
  fab: {
    backgroundColor: theme.palette.primary.contrastText,
    marginRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.primary.contrastText,
    },
    position: 'relative',
    top: -theme.spacing(1),
  },
}));

export default ({ open = false, onClose, user }) => {
  const classes = useStyles();

  return (
    <Collapse in={open} timeout={100}>
      <Box>
        {actions.map(({ icon, name, handler }) => (
          <Grow key={name} in={open}>
            <Tooltip title={name} aria-label={name} placement="top">
              <Fab
                onClick={() => { handler(user); onClose(); }}
                className={classes.fab}
                size="small"
                aria-label={name}
              >
                {icon}
              </Fab>
            </Tooltip>
          </Grow>
        ))}
      </Box>
    </Collapse>
  );
};
