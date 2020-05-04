import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    backgroundColor: '#000',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    height: '100%',
  },
  video: {
    maxWidth: '100%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.videoContainer}>
      <img id="video" className={classes.video} src="/img/samples/student-webcam-example.jpg" alt="Изображение из камеры" />
    </div>
  );
};
