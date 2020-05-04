import React from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Login from './scenes/login';
import TeacherHud from './scenes/teacher-hud';
import StudentHud from './scenes/student-hud';

const customTheme = createMuiTheme({
  palette: {
    // type: 'dark',
  },
  layoutSpacing: 3,
  layoutPaperElevation: 1,
  layoutPaperVariant: 'elevation',
});

const useStyles = makeStyles((theme) => ({
  root: {
    // height: '100%',
    margin: theme.spacing(2),
  },
}));

export default function () {
  const classes = useStyles();

  return (
    <ThemeProvider theme={customTheme}>
      <div className={classes.root}>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/student">
            <TeacherHud />
          </Route>
          <Route path="/teacher">
            <TeacherHud />
          </Route>
          <Route>
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    </ThemeProvider>
  );
}
