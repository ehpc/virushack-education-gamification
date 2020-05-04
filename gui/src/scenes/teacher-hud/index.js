import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import FunnyIcon from '../../components/funny-icon';
import VideoStream from '../../components/webRTC/VideoStream';

const spacing = 3;
const lessonName = 'Математика для математиков';
const elevation = 1;
const variant = 'elevation';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '100%',
  },
  videoContainer: {
    backgroundColor: '#000',
    borderRadius: theme.shape.borderRadius,
  },
  video: {
    maxWidth: '100%',
  },
  column: {
    display: 'flex',
  },
  actionsColumn: {
    order: 1,
    [theme.breakpoints.down('sm')]: {
      order: 2,
    },
  },
  videoColumn: {
    order: 2,
    [theme.breakpoints.down('sm')]: {
      order: 1,
    },
  },
  usersColumn: {
    order: 3,
  },
  iconColumn: {
    order: 1,
  },
  headingColumn: {
    order: 2,
    [theme.breakpoints.down('sm')]: {
      order: 3,
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  timerColumn: {
    order: 3,
    [theme.breakpoints.down('sm')]: {
      order: 2,
    },
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

export default function () {
  const classes = useStyles();

  const [duration, setDuration] = useState(0);

  // Обновление времени конференции
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prevDuration) => prevDuration + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  function formatDuration(seconds) {
    const minutes = String(Math.trunc(seconds / 60));
    const remainder = String(seconds % 60);
    return `${minutes.padStart(2, '0')}:${remainder.padStart(2, '0')}`;
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={spacing}
      >
        <Grid className={classes.iconColumn} item md={2} xs={6}>
          <FunnyIcon src="kitty/016-kitty-33" size="md" />
        </Grid>
        <Grid className={classes.headingColumn} item md={8} xs={12}>
          <Typography variant="h4">
            Урок &quot;
            {lessonName}
            &quot;
          </Typography>
        </Grid>
        <Grid className={classes.timerColumn} item md={2} xs={6}>
          <Typography variant="h4">
            {formatDuration(duration)}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
      >
        <Grid className={`${classes.column} ${classes.actionsColumn}`} item xs={12} md={3}>
          <Paper className={classes.paper} variant={variant} elevation={elevation}>ACTIONS</Paper>
        </Grid>
        <Grid className={`${classes.column} ${classes.videoColumn}`} item xs={12} md={6}>
          <Paper className={classes.paper} variant={variant} elevation={elevation}>
            <div className={classes.videoContainer}>
              <VideoStream/>
              {/* <img className={classes.video} src="/img/student-webcam-example.jpg" alt="Изображение из камеры" /> */}
            </div>
          </Paper>
        </Grid>
        <Grid className={`${classes.column} ${classes.usersColumn}`} item xs={12} md={3}>
          <Paper className={classes.paper} variant={variant} elevation={elevation}>USERS</Paper>
        </Grid>
      </Grid>
    </div>
  );
}
