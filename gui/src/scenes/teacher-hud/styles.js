import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    width: '100%',
  },
  secondary: {
    color: theme.palette.text.secondary,
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
    height: 'calc(100vh - 200px)',
    overflowY: 'auto',
  },
  videoColumn: {
    order: 2,
    [theme.breakpoints.down('md')]: {
      order: 1,
    },
  },
  videoPaper: {
    height: 'calc(100vh - 200px)',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
  },
  usersColumn: {
    order: 3,
  },
  usersPaper: {
    height: 'calc(100vh - 200px)',
    overflowY: 'auto',
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
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
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
