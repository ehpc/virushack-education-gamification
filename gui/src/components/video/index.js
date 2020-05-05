import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TeacherRTC from '../webRTC/teacherRTC';
import StudentRTC from '../webRTC/studentRTC';

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

export default (props) => {
  const classes = useStyles();
  return (
    <div className={classes.videoContainer}>
      {/* <img id="video" className={classes.video} src="/img/samples/student-webcam-example.jpg" alt="Изображение из камеры" /> */}
      {props.teacher ? <TeacherRTC className={classes.video} yourId={1} /> : <StudentRTC className={classes.video} yourId={Math.random() * 100000 + 1} />}
    </div>
  );
};
