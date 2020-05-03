import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Grow from '@material-ui/core/Grow';
import sample from 'lodash/sample';
import random from 'lodash/random';
import format from 'date-fns/format';

import FunnyIcon from '../../components/funny-icon';
import ClockIcon from '../../components/clock-icon';

const spacing = 3;
const lessonName = 'Математика для математиков';
const elevation = 1;
const variant = 'elevation';

const actionTypes = {
  yes: {
    text: 'ответил "да"',
    priority: 'green',
    icon: 'yes',
  },
  no: {
    text: 'ответил "нет"',
    priority: 'red',
    icon: 'no',
  },
  ask: {
    text: 'поднял руку',
    priority: 'green',
    icon: 'ask',
  },
  left: {
    text: 'отошел без предупреждения',
    priority: 'red',
  },
  timeout: {
    text: 'отошел с предупреждением',
    priority: 'default',
  },
  back: {
    text: 'вернулся',
    priority: 'default',
  },
  smoke: {
    text: 'курит',
    priority: 'red',
  },
};

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
      id: random(1000), ...sample(samplePerks),
    }));
    return user;
  });
function* actionMaker() {
  const actionKeys = Object.keys(actionTypes);
  let id = 1;
  while (true) {
    yield {
      user: sample(sampleUsers),
      action: sample(actionKeys),
      id,
      time: new Date().getTime(),
    };
    id += 1;
  }
}
const actionGenerator = actionMaker();

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    width: '100%',
  },
  secondary: {
    color: theme.palette.text.secondary,
  },
  videoContainer: {
    backgroundColor: '#000',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  video: {
    maxWidth: '100%',
  },
  column: {
    display: 'flex',
  },
  actionsColumn: {
    order: 1,
    [theme.breakpoints.down('md')]: {
      order: 2,
    },
  },
  actionsPaper: {
    maxHeight: '100vh',
    overflowY: 'auto',
  },
  videoColumn: {
    order: 2,
    [theme.breakpoints.down('md')]: {
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
  timestamp: {
    textAlign: 'right',
  },
  priorityred: {
    color: theme.palette.error.main,
  },
  prioritygreen: {
    color: theme.palette.success.main,
  },
  prioritydefault: {
    color: theme.palette.text.secondary,
  },
  actionIcon: {
    verticalAlign: 'middle',
    marginLeft: theme.spacing(1),
  },
  perksContainer: {
    position: 'relative',
  },
  perksList: {
    position: 'absolute',
    display: 'block',
    right: 0,
  },
  perkIcon: {
    marginLeft: theme.spacing(1),
  },
}));

/**
 * Форматирует часы конференции
 * @param {number} seconds Сколько секунд прошло
 */
function formatDuration(seconds) {
  const minutes = String(Math.trunc(seconds / 60));
  const remainder = String(seconds % 60);
  return `${minutes.padStart(2, '0')}:${remainder.padStart(2, '0')}`;
}

/**
 * Форматирует время сообщения
 * @param {number} timestamp Метка времени
 */
function formatTimestamp(timestamp) {
  return format(timestamp, 'HH:mm:ss');
}

export default function () {
  const classes = useStyles();

  // Часы конференции
  const [duration, setDuration] = useState(0);

  // Обновление времени конференции
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prevDuration) => prevDuration + 1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

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
          user.status = actionTypes[newAction.action].text;
        }
        return user;
      }));
    }, random(500, 2000));
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
          <ClockIcon size="md" text={formatDuration(duration)} />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
      >
        <Grid className={`${classes.column} ${classes.actionsColumn}`} item xs={12} lg={3}>
          <Paper className={`${classes.paper} ${classes.actionsPaper}`} variant={variant} elevation={elevation}>
            <List>
              {actions.map(({
                id, user, action, time,
              }) => (
                <Grow key={id} in timeout={500}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt={user.name} src={user.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={(
                        <Grid container>
                          <Grid item xs={7}>
                            <Typography variant="subtitle2">{user.name}</Typography>
                          </Grid>
                          <Grid className={classes.timestamp} item xs={5}>
                            <Typography
                              className={classes.secondary}
                              variant="caption"
                            >
                              {formatTimestamp(time)}
                            </Typography>
                          </Grid>
                        </Grid>
                    )}
                      secondary={(
                        <Typography className={classes[`priority${actionTypes[action].priority}`]} variant="body2">
                          {actionTypes[action].text}
                          {actionTypes[action].icon
                          && (
                            <FunnyIcon
                              className={classes.actionIcon}
                              alt={actionTypes[action].text}
                              src={`actions/${actionTypes[action].icon}`}
                              size="xxs"
                            />
                          )}
                        </Typography>
                    )}
                    />
                  </ListItem>
                </Grow>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid className={`${classes.column} ${classes.videoColumn}`} item xs={12} lg={6}>
          <Paper className={classes.paper} variant={variant} elevation={elevation}>
            <div className={classes.videoContainer}>
              <img id="video" className={classes.video} src="/img/samples/student-webcam-example.jpg" alt="Изображение из камеры" />
            </div>
          </Paper>
        </Grid>
        <Grid className={`${classes.column} ${classes.usersColumn}`} item xs={12} lg={3}>
          <Paper className={classes.paper} variant={variant} elevation={elevation}>
            <List>
              {users.map(({
                id, name, avatar, status, perks,
              }) => (
                <ListItem key={id}>
                  <ListItemAvatar>
                    <Avatar alt={name} src={avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={(
                      <Grid container>
                        <Grid item xs={7}>
                          <Typography variant="subtitle2">{name}</Typography>
                        </Grid>
                        <Grid className={`${classes.timestamp} ${classes.perksContainer}`} item xs={5}>
                          {
                            perks.length
                            && (
                              <Typography
                                className={`${classes.secondary} ${classes.perksList}`}
                                variant="caption"
                              >
                                {perks.map(({ icon, id }) => (
                                  <FunnyIcon
                                    key={id}
                                    className={classes.perkIcon}
                                    src={`perks/${icon}`}
                                    size="xxs"
                                  />
                                ))}
                              </Typography>
                            )
                          }

                        </Grid>
                      </Grid>
                    )}
                    secondary={(
                      <Typography className={classes.prioritydefault} variant="body2">
                        {status || <>&nbsp;</>}
                      </Typography>
                    )}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
