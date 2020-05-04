import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { teal, indigo } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';

import FunnyIcon from '../../components/funny-icon';

const useStyles = makeStyles((theme) => ({
  studentButton: {
    color: theme.palette.getContrastText(teal[700]),
    backgroundColor: teal[500],
    '&:hover': {
      backgroundColor: teal[700],
    },
  },
  teacherButton: {
    color: theme.palette.getContrastText(indigo[700]),
    backgroundColor: indigo[500],
    '&:hover': {
      backgroundColor: indigo[700],
    },
  },
  npc: {
    marginBottom: theme.spacing(2),
  },
  heading: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  link: {
    textDecoration: 'none',
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <Container maxWidth="md">
      <Typography className={classes.heading} align="center" variant="h2">
        Учись легко!
      </Typography>
      <Grid
        container
        spacing={10}
      >
        <Grid item xs={12} sm={6}>
          <FunnyIcon className={classes.npc} src="misc/learning-kitty" fit />
          <Link className={classes.link} to="/student">
            <Button className={classes.studentButton} variant="contained" size="large" fullWidth>Я ученик</Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FunnyIcon className={classes.npc} src="kitty/038-kitty-12" fit />
          <Link className={classes.link} to="/teacher">
            <Button className={classes.teacherButton} variant="contained" size="large" fullWidth>Я учитель</Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};
