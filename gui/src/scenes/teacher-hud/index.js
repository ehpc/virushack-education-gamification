import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import sample from 'lodash/sample';
import random from 'lodash/random';

import useStyles from './styles';
import Video from '../../components/video';
import FunnyIcon from '../../components/funny-icon';
import Clock from '../../components/clock';
import ActionList from '../../components/action-list';
import UserList from '../../components/user-list';
import actionTypes from '../../models/action-types';

const spacing = 3;
const lessonName = 'Математика для математиков';
const elevation = 1;
const variant = 'elevation';

const samplePerks = [
  { icon: 'star' },
  { icon: 'banana' },
  { icon: 'sun' },
  { icon: 'badge' },
];
const sampleUsers = [
  { id: '1', name: 'Борат', avatar: '/img/samples/avatar-borat.jpg' },
  { id: '2', name: 'Маша', avatar: '/img/samples/avatar-masha.jpg' },
  { id: '3', name: 'Ангелина', avatar: '/img/samples/avatar-angelina.jpg' },
  { id: '4', name: 'Seymour', avatar: '/img/samples/avatar-seymour.jpg' },
]
  .map((user) => {
    user.perks = Array(random(1, 7)).fill(true).map(() => ({
      id: random(100000), ...sample(samplePerks),
    }));
    return user;
  });
function* actionMaker() {
  const actionKeys = Object.keys(actionTypes);
  let id = 1;
  while (true) {
    yield {
      user: sample(sampleUsers),
      name: sample(actionKeys),
      id,
      time: new Date().getTime(),
    };
    id += 1;
  }
}
const actionGenerator = actionMaker();

export default function () {
  const classes = useStyles();

  // Информация о пользователях
  const [users, setUsers] = useState(sampleUsers);

  // Совершённые действия
  const [actions, setAction] = useState([]);

  // Генератор действий
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAction = actionGenerator.next().value;
      setAction((prevActions) => [newAction].concat(prevActions));
      setUsers((prevUsers) => prevUsers.map((user) => {
        if (user.id === newAction.user.id) {
          return {
            ...user,
            status: actionTypes[newAction.name].text,
          };
        }
        return user;
      }));
    }, random(2000, 3000));
    return () => clearTimeout(timer);
  }, [actions]);

  return (
    <>
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
          <Clock />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
      >
        <Grid className={`${classes.column} ${classes.actionsColumn}`} item xs={12} lg={3}>
          <Paper className={`${classes.paper} ${classes.actionsPaper}`} variant={variant} elevation={elevation}>
            <ActionList actions={actions} />
          </Paper>
        </Grid>
        <Grid className={`${classes.column} ${classes.videoColumn}`} item xs={12} lg={6}>
          <Paper className={`${classes.paper} ${classes.videoPaper}`} variant={variant} elevation={elevation}>
            <Video />
          </Paper>
        </Grid>
        <Grid className={`${classes.column} ${classes.usersColumn}`} item xs={12} lg={3}>
          <Paper className={`${classes.paper} ${classes.usersPaper}`} variant={variant} elevation={elevation}>
            <UserList users={users} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
