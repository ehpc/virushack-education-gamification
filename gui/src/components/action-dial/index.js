import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import FunnyIcon from '../funny-icon';
import './index.scss';

const actions = [
  { icon: <FunnyIcon src="teacher-actions/add-coins" size="xxs" />, name: '+100' },
  { icon: <FunnyIcon src="perks/star" size="xxs" />, name: 'Молодец' },
  { icon: <FunnyIcon src="perks/badge" size="xxs" />, name: 'Часто отвечает' },
  { icon: <FunnyIcon src="perks/sad" size="xxs" />, name: 'Совсем не отвечает' },
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
  icon: {
  },
}));

export default ({ children = <></> }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <SpeedDial
      ariaLabel="Действия"
      className={classes.speedDial}
      icon={children}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction="right"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={handleClose}
        />
      ))}
    </SpeedDial>
  );
};
