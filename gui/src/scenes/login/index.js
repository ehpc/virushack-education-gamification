import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { teal, indigo } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';

import FunnyIcon from '../../components/funny-icon';
import dbModel from '../../models/db';

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
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleConnect() {
    if (email.length && email.includes('@')) {
      const user = await dbModel.userLogin(email);
      if (user) {
        setOpen(false);
        history.push(user.teacher ? '/teacher' : '/student');
      } else {
        setError('Такого пользователя не существует');
      }
    } else {
      setError('Укажите корректный Email');
    }
  }

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
          <Button onClick={handleClickOpen} className={classes.studentButton} variant="contained" size="large" fullWidth>Я ученик</Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FunnyIcon className={classes.npc} src="kitty/038-kitty-12" fit />

          <Button onClick={handleClickOpen} className={classes.teacherButton} variant="contained" size="large" fullWidth>Я учитель</Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Подключение к уроку</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Чтобы подключиться к уроку, пожалуйста, заполните следующую форму.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Ваш email-адрес"
            type="email"
            autoComplete="email"
            value={email}
            onChange={({ target }) => { setError(false); setEmail(target.value); }}
            fullWidth
          />
          {
            error
            && (
            <Alert severity="error">
              <AlertTitle>Ошибка</AlertTitle>
              {error}
            </Alert>
            )
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConnect} color="primary">
            Подключиться
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
