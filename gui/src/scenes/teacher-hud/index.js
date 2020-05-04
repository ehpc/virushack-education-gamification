import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import random from 'lodash/random';

import useStyles from './styles';
import Video from '../../components/video';
import FunnyIcon from '../../components/funny-icon';
import Clock from '../../components/clock';
import ActionList from '../../components/action-list';
import UserList from '../../components/user-list';
import { getActionData } from '../../models/action-types';
import dbModel from '../../models/db';
import { actionGenerator, sampleUsers } from '../../models/samples';

const roomName = 'Урок "Математика для математиков"';

const fakeIt = false;
const defaultActions = Array(20).fill(true).map(() => actionGenerator.next().value);

export default () => {
  const theme = useTheme();
  const classes = useStyles();

  // Информация о пользователях
  const [users, setUsers] = useState(fakeIt ? sampleUsers : []);

  // Совершённые действия
  const [actions, setAction] = useState(fakeIt ? defaultActions : []);

  useEffect(() => {
    (async () => {
      const {
        users: initialUsers,
        actions: initialActions,
      } = await dbModel.getStructuredData();
      setUsers(initialUsers);
      setAction(initialActions);
    })();
  }, []);

  // Генератор действий
  if (fakeIt) {
    useEffect(() => {
      const timer = setTimeout(() => {
        const newAction = actionGenerator.next().value;
        setAction((prevActions) => [newAction].concat(prevActions));
        setUsers((prevUsers) => prevUsers.map((user) => {
          if (user.id === newAction.user.id) {
            return {
              ...user,
              status: getActionData(newAction.name).text,
            };
          }
          return user;
        }));
      }, random(1000, 3000));
      return () => clearTimeout(timer);
    }, [actions]);
  }

  return (
    <>
      <Grid
        container
        spacing={theme.layoutSpacing}
      >
        <Grid className={classes.iconColumn} item md={2} xs={6}>
          <Link to="/">
            <FunnyIcon src="kitty/016-kitty-33" size="md" />
          </Link>
        </Grid>
        <Grid className={classes.headingColumn} item md={8} xs={12}>
          <Typography variant="h4">
            {roomName}
          </Typography>
        </Grid>
        <Grid className={classes.timerColumn} item md={2} xs={6}>
          <Clock />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={theme.layoutSpacing}
      >
        <Grid className={`${classes.column} ${classes.actionsColumn}`} item xs={12} lg={3}>
          <Paper
            className={`${classes.paper} ${classes.actionsPaper}`}
            variant={theme.layoutPaperVariant}
            elevation={theme.layoutPaperElevation}
          >
            <ActionList actions={actions} />
          </Paper>
        </Grid>
        <Grid className={`${classes.column} ${classes.videoColumn}`} item xs={12} lg={6}>
          <Paper
            className={`${classes.paper} ${classes.videoPaper}`}
            variant={theme.layoutPaperVariant}
            elevation={theme.layoutPaperElevation}
          >
            <Video />
          </Paper>
        </Grid>
        <Grid className={`${classes.column} ${classes.usersColumn}`} item xs={12} lg={3}>
          <Paper
            className={`${classes.paper} ${classes.usersPaper}`}
            variant={theme.layoutPaperVariant}
            elevation={theme.layoutPaperElevation}
          >
            <UserList users={users} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
