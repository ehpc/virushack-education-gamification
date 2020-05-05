import firebase from 'firebase/app';
import 'firebase/database';

import { getAvatarForString } from './samples';

const logger = console;
export const notSoSecret = 'ya_uchilka';

logger.log('>>>', firebase);
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const asd = firebase.analytics()
const uchilkaDB = firebase.database();
logger.log('[uchilkaDB] CONNECTED');
firebase.database.enableLogging((message) => {
  if (message.indexOf('handleServerMessage') !== -1) {
    logger.log('[uchilkaDB]', message);
  }
});

// connListener
const ref = uchilkaDB.ref('users');
ref.orderByKey().endAt('Антонина Ивановна').on('child_added', (snapshot) => {
  logger.log(snapshot.key, 'подключен');
});


// ЗАПИСЬ НОВОГО ЮЗЕРА В БД
function addUser(name, email, pwd, secret, coins) {
  let teacher = false;
  const newUser = 0; // костыль
  if (secret === 'ya_uchilka') {
    teacher = true;
  }
  // ////////
  const abc = 'abcdef1234567890';
  let userId = '';
  while (userId.length < 15) {
    userId += abc[Math.floor(Math.random() * abc.length)];
  }
  userId = `user_${userId}`;
  // ////////
  try {
    const newUserInner = uchilkaDB.ref(`users/${userId}`).set({
      name,
      email,
      pwd,
      teacher,
      coins,
    });
    logger.log(newUserInner, 'addUser suckcess');
  } catch (error) {
    logger.log('addUser failed');
  }
  return newUser;
}
// addUser('Maria Ivanovna', 'teacher@mail.ru', 123123, 'ya_uchilka', 9999999);
// addUser('Gennadiy', 'g@mail.ru', 123123, 'secret', 500);


// ОБНОВЛЕНИЕ ЮЗЕРА В БД
async function updateUser(userId, name, email, pwd, secret, coins) {
  let teacher = false;
  if (secret === 'ya_uchilka') {
    teacher = true;
  }
  try {
    await uchilkaDB.ref(`users/${userId}`).set({ // TODO: сделать update а не set
      name,
      email,
      pwd,
      teacher,
      coins,
    });
    logger.log(userId, 'updateUser suckcess');
  } catch (error) {
    logger.log(error, 'updateUser failed');
  }
  return userId;
}
// updateUser('user_3q5shnlak6a1gyz', 'Oleg', 'ol@mail.ru', '123123', 'secret', 150);


// ЗАЛОГИНИТЬСЯ
// async function userLogin(email, pwd) {
//   try {
//     const rawQ = await uchilkaDB.ref('/users').once('value');
//     const fullObject = rawQ.val();
//     let keys = Object.keys(fullObject);
//     for (keys in fullObject) {
//       if (fullObject[keys].email === email && fullObject[keys].pwd == pwd) {
//         logger.log(fullObject[keys].email, fullObject[keys].pwd, 'authorized');
//         return true;
//       }
//       logger.log('401 gay attempt');
//       return false;
//     }
//   } catch (error) {
//     logger.log('userLogin ERROR');
//   }
//   return true;
// }
// userLogin('ol@mail.ru', '123123');


// ДОБАВИТЬ/ОТНЯТЬ КОИНЫ
async function updateUserCoins(userId, secret, coinsss) {
  if (secret === 'ya_uchilka') {
    let updatedCoins = 0; // костыль
    try {
      const userCoins = await uchilkaDB.ref(`/users/${userId}`).once('value');
      const coins = userCoins.val().coins + coinsss;
      updatedCoins = await uchilkaDB.ref(`users/${userId}`).update({
        coins,
      });
      logger.log(`updateUserCoins suckcess, ${userId} have ${coins} now`);
    } catch (error) {
      logger.log(error, 'updateUserStatus failed');
    }
    return updatedCoins;
  }
  return false;
}
// updateUserCoins('user_3q5shnlak6a1gyz', 'ya_uchilka', 5000);


// ИЗМЕНИТЬ СТАТУС
async function updateUserStatus(userId, secret, status) {
  if (secret === 'ya_uchilka') {
    const now = Date.now();
    const userStatusQ = await uchilkaDB.ref(`/users/${userId}`).once('value');
    let userStatus = userStatusQ.val().status;
    if (!userStatus || userStatus.length < 3) { userStatus = {}; }
    userStatus[now] = status;
    // eslint-disable-next-line prefer-spread
    const latestStatus = Math.max.apply(Math, Object.keys(userStatus));
    const latestUserStatus = JSON.stringify({ [userId]: userStatus[latestStatus] });
    try {
      await uchilkaDB.ref(`users/${userId}`).update({
        status: userStatus,
      });
      logger.log(`updateUserStatus suckcess, ${latestUserStatus} now`);
    } catch (error) {
      logger.log(error, 'updateUserStatus failed');
    }
    return latestUserStatus;
  }
  return false;
}
// updateUserStatus('user_3q5shnlak6a1gyz', 'ya_uchilka', 'прогульщик');


// ИЗМЕНИТЬ СОСТОЯНИЕ
async function updateUserState(userId, state) {
  const now = Date.now();
  const userStateQ = await uchilkaDB.ref(`/users/${userId}`).once('value');
  
  let userState;
  if(userStateQ && userStateQ.val()) {
    userState = userStateQ.val().state
  }
   // ??????????
  
   if (!userState || userState.length < 3) { userState = {}; }
  userState[now] = state;
  // eslint-disable-next-line prefer-spread
  const latestState = Math.max.apply(Math, Object.keys(userState));
  const latestUserState = JSON.stringify({ [userId]: userState[latestState] });
  try {
    await uchilkaDB.ref(`users/${userId}`).update({
      state: userState,
    });
    logger.log(`updateUserState suckcess, ${latestUserState} now`);
  } catch (error) {
    logger.log(error, 'updateUserState failed');
  }
  return latestUserState;
}
// updateUserState('user_3q5shnlak6a1gyz', 'ответил ДА');


// ОТОЙТИ С ПРЕДУПРЕЖДЕНИЕМ
async function updateUserAway(userId) {
  const now = Date.now();
  const updatedUserAway = JSON.stringify({ [userId]: [now] });
  updateUserState(userId, 'отошел с предупреждением');
  setTimeout(updateUserState, 10000, 'отошел без предупреждения');
  try {
    await uchilkaDB.ref(`users/${userId}`).update({
      away_from: now,
    });
    logger.log(`updateUserAway suckcess, ${updatedUserAway} now`);
  } catch (error) {
    logger.log(error, 'updateUserAway failed');
  }
  return updatedUserAway;
}
// updateUserAway('user_3q5shnlak6a1gyz');


// ВЕРНУТЬСЯ
async function updateUserArrive(userId) {
  const now = Date.now();
  const updatedUserArrive = JSON.stringify({ [userId]: [now] });
  updateUserState(userId, 'на месте');
  try {
    await uchilkaDB.ref(`users/${userId}`).update({
      away_from: null,
    });
    logger.log(`updateUserArrive suckcess, ${updatedUserArrive} now`);
  } catch (error) {
    logger.log(error, 'updateUserArrive failed');
  }
  // logger.log(updatedUserArrive);
  return updatedUserArrive;
}
// updateUserArrive('user_3q5shnlak6a1gyz');


// ПОЛУЧИТЬ ИЗ СПИСОК ЮЗЕРОВ
async function getUsers() {
  const rawQ = await uchilkaDB.ref('/users').once('value');
  const fullObject = rawQ.val();
  logger.log(fullObject, 'this is USEEEEERS!!!');
  return fullObject;
}
// getUsers();

/**
 * Структурирует данные БД, чтобы легче работать
 * @param {object} users Объект с пользователями
 */
function structureData(users) {
  const usersStructured = Object.entries(users)
    .map(([id, user]) => {
      if (!user.id) {
        user.id = id;
      }
      if (!user.avatar) {
        user.avatar = getAvatarForString(user.name);
      }
      if (!user.perks) {
        user.perks = Object.entries(user.status || [])
          .map(([timestamp, perkName]) => ({
            id: `${user.id}#${timestamp}`,
            timestamp: Number(timestamp),
            name: perkName,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
      }
      user.lastStatus = user.perks.length
        ? user.perks[user.perks.length - 1]
        : '';
      return user;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  const actions = usersStructured
    .flatMap(
      (user) => Object.entries(user.state || {})
        .map(([timestamp, actionName]) => ({
          id: `${user.id}#${timestamp}`,
          name: actionName,
          user,
          timestamp: Number(timestamp),
        })),
    )
    .sort((a, b) => b.timestamp - a.timestamp);
  return {
    users: usersStructured,
    actions,
  };
}

/**
 * Получает данные пользователей в структурированном виде
 */
async function getStructuredData() {
  return structureData(await getUsers());
}

// Слушаем изменения в юзерах
const usersListeners = new Map();
const usersRef = firebase.database().ref('users');
usersRef.on('value', (snapshot) => {
  const data = structureData(snapshot.val());
  Array.from(usersListeners.keys()).forEach((listener) => {
    if (typeof listener === 'function') {
      listener(data);
    }
  });
});

/**
 * Навешивает слушатель обновлений в юзерах
 * @param {function} listener Слушатель
 * @param {boolean} exclusive Может быть только один слушатель
 */
function onUsers(listener, exclusive = true) {
  if (exclusive) {
    usersListeners.clear();
  }
  usersListeners.set(listener, true);
}

export default {
  updateUser,
  // userLogin,
  updateUserCoins,
  addUser,
  updateUserStatus,
  updateUserState,
  updateUserAway,
  updateUserArrive,
  getUsers,
  getStructuredData,
  onUsers,
};
