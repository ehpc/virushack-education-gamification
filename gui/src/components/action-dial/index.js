import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';
import Tooltip from '@material-ui/core/Tooltip';

import FunnyIcon from '../funny-icon';

const actions = [
  { icon: <FunnyIcon src="teacher-actions/add-coins" size="xxs" />, name: '+100' },
  { icon: <FunnyIcon src="actions/star" size="xxs" />, name: 'Молодец' },
  { icon: <FunnyIcon src="actions/badge" size="xxs" />, name: 'Часто отвечает' },
  { icon: <FunnyIcon src="actions/sad" size="xxs" />, name: 'Совсем не отвечает' },
  { icon: <FunnyIcon src="teacher-actions/remove-coins" size="xxs" />, name: '-100' },
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

export default ({ open = false, onClose }) => {
  const classes = useStyles();

  return (
    <Collapse in={open} timeout={100}>
      <Box>
        {actions.map(({ icon, name }) => (
          <Grow key={name} in={open}>
            <Tooltip title={name} aria-label={name} placement="top">
              <Fab onClick={onClose} className={classes.fab} size="small" aria-label={name}>
                {icon}
              </Fab>
            </Tooltip>
          </Grow>
        ))}
      </Box>
    </Collapse>
  );
};
