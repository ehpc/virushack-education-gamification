	async function fire() {
		// TODO: Replace the following with your app's Firebase project configuration
		const firebaseConfig = {
			apiKey: "AIzaSyCEy_Mh-mM4CevqQ2Au7JGealnndtirj4c",
			authDomain: "uchilka-5e065.firebaseapp.com",
			databaseURL: "https://uchilka-5e065.firebaseio.com",
			projectId: "uchilka-5e065",
			storageBucket: "uchilka-5e065.appspot.com",
			messagingSenderId: "460642119976",
			appId: "1:460642119976:web:de89ed0d1a9e7b8e65e01d",
			measurementId: "G-W5MVK1GE24"
		};

		// Initialize Firebase

			firebase.initializeApp(firebaseConfig);
			//const asd = firebase.analytics()
			const uchilkaDB = firebase.database();
			console.log("[uchilkaDB] CONNECTED");
			firebase.database.enableLogging(function(message) {
				if (~message.indexOf('handleServerMessage')){
					console.log("[uchilkaDB]", message);
				}
			});

		//connListener
		var ref = uchilkaDB.ref("users");
		ref.orderByKey().endAt("Антонина Ивановна").on("child_added", function(snapshot) {
		  console.log(snapshot.key, 'подключен');
		});
/*		
		//testListener
		uchilkaDB.ref().on("child_added", function(snapshot) {
		  console.log(snapshot.key, 'эээээээ уасяыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыы');
		});
*/


		// ЗАПИСЬ НОВОГО ЮЗЕРА В БД
		function addUser(name, email, pwd, secret, coins) {
			let teacher = false;
			if (secret == 'ya_uchilka') {
				teacher = true;
			};
			//////////
			var abc = "abcdef1234567890";
			var userId = "";
			while (userId.length < 15) {
				userId += abc[Math.floor(Math.random() * abc.length)];
			}
			userId = 'user_' + userId;
			//////////
			const newUser = uchilkaDB.ref('users/' + userId).set({
				name,
				email,
				pwd,
				teacher,
				coins
			}, function(error) {
				if (error) {
					console.log(newUser, 'addUser failed')
				} else {
					console.log(newUser, 'addUser suckcess')
				}
			});
			return newUser;
		}
		//addUser('Maria Ivanovna', 'teacher@mail.ru', 123123, 'ya_uchilka', 9999999);
		//addUser('Valera', 'v@mail.ru', 123123, 'secret', 500);


		// ОБНОВЛЕНИЕ ЮЗЕРА В БД
		function updateUser(userId, name, email, pwd, secret, coins) {
			const teacher = false;
			if (secret == 'ya_uchilka') {
				teacher = true;
			};
			const updatedUser = uchilkaDB.ref('users/' + userId).set({
				name,
				email,
				pwd,
				teacher,
				coins
			}, function(error) {
				if (error) {
					console.log(updatedUser, 'updatedUser failed');
				} else {
					console.log(updatedUser, 'updatedUser suckcess');
				}
			});
			return updatedUser;
		}
		//updateUser('user_cxnp3doa7ozs7ot', 'Olegka Olegi4', 'ollll@mail.ru', '123123', 'secret', 150);


		// ЗАЛОГИНИТЬСЯ 
/*		async function userLogin(email, pwd) {
			
				const userCred = await uchilkaDB.ref('users').child("email").push();
				console.log(userCred);
*/				
/*				const updatedCoins = await uchilkaDB.ref('users/' + userId).update({
					coins
				}, function(error) {
					if (error) {
						console.log('updateUserCoins failed');
					} else {
						console.log('updateUserCoins suckcess, ' + coins + ' now');
					}
				});
				return updatedCoins;
			
		}	*/
		//userLogin('ollll@mail.ru', '123123');


		// ДОБАВИТЬ/ОТНЯТЬ КОИНЫ
		async function updateUserCoins(userId, secret, coinsss) {
			if (secret == 'ya_uchilka') {
				const userCoins = await uchilkaDB.ref('/users/' + userId).once('value');
				let coins = userCoins.val().coins + coinsss;
				const updatedCoins = await uchilkaDB.ref('users/' + userId).update({
					coins
				}, function(error) {
					if (error) {
						console.log('updateUserCoins failed');
					} else {
						console.log('updateUserCoins suckcess, ' + coins + ' now');
					}
				});
				return updatedCoins;
			}
		}	
		//updateUserCoins('user_cxnp3doa7ozs7ot', 'ya_uchilka', 500);

		// ИЗМЕНИТЬ СТАТУС
		async function updateUserStatus(userId, secret, status) {
			if (secret == 'ya_uchilka') {
				const now = Math.floor(Date.now() / 1000);
				const userStatusQ = await uchilkaDB.ref('/users/' + userId).once('value');
				let userStatus = userStatusQ.val().status;
				if (!userStatus || userStatus.length < 3) {userStatus = {}};
				userStatus[now] = status;
				const latestStatus = Math.max.apply(Math, Object.keys(userStatus));
				const latestUserStatus = JSON.stringify({[userId] : userStatus[latestStatus]});
				const updatedStatus = await uchilkaDB.ref('users/' + userId).update({
					status:userStatus
				}, function(error) {
					if (error) {
						console.log('updateUserCoins failed');
					} else {
						console.log('updateUserCoins suckcess, ' + latestUserStatus + ' now');
					}
				});
				return latestUserStatus;
			}
		}	
		//updateUserStatus('user_3jn5k6df9ajdevx', 'ya_uchilka', 'снова молодец');


		// ИЗМЕНИТЬ СОСТОЯНИЕ
		async function updateUserState(userId, state) {
				//const userState = await uchilkaDB.ref('/users/' + userId).once('state');
				//let coins = userState.val().coins + coinsss;
				const now = Math.floor(Date.now() / 1000);
				const userStateQ = await uchilkaDB.ref('/users/' + userId).once('value');
				let userState = userStateQ.val().state;
				if (!userState || userState.length < 3) {userState = {}};
				userState[now] = state;
				const latestState = Math.max.apply(Math, Object.keys(userState));
				const latestUserState = JSON.stringify({[userId] : userState[latestState]});
				//console.log(JSON.stringify({[userId] : userState[latestState]}), 'ssssssssssssssssssssstate')
				const updatedState = await uchilkaDB.ref('users/' + userId).update({
					state:userState
				}, function(error) {
					if (error) {
						console.log('updateUserState failed');
					} else {
						console.log('updateUserState suckcess, ' + latestUserState + ' now');
					}
				});
				//const eee = JSON.stringify({[userId] : [state]});
				//console.log(eee)
				return latestUserState;
		}	
		//updateUserState('user_3jn5k6df9ajdevx', 'поднял руку');


		// ОТОЙТИ С ПРЕДУПРЕЖДЕНИЕМ
		async function updateUserAway(userId) {
				const now = Math.floor(Date.now() / 1000);
				const updatedUserAway = JSON.stringify({[userId] : [now]});
				updateUserState(userId, 'отошел с предупреждением');
				setTimeout(updateUserState, 10000, 'отошел без предупреждения');
				const updatedAway = await uchilkaDB.ref('users/' + userId).update({
					away_from:now
				}, function(error) {
					if (error) {
						console.log('updateUserAway failed');
					} else {
						console.log('updateUserAway suckcess, ' + updatedUserAway + ' now');
					}
				});
				
				console.log(updatedUserAway);
				return updatedUserAway;
		}	
		//updateUserAway('user_3q5shnlak6a1gyz');

		// ВЕРНУТЬСЯ
		async function updateUserArrive(userId) {
				const now = Math.floor(Date.now() / 1000);
				const updatedUserArrive = JSON.stringify({[userId] : [now]});
				updateUserState(userId, 'на месте');
				const updatedArrive = await uchilkaDB.ref('users/' + userId).update({
					away_from:null
				}, function(error) {
					if (error) {
						console.log('updateUserArrive failed');
					} else {
						console.log('updateUserArrive suckcess, ' + updatedUserArrive + ' now');
					}
				});
				//console.log(updatedUserArrive);
				return updatedUserArrive;
		}	
		//updateUserArrive('user_3q5shnlak6a1gyz');

		function readUsers(){
		const userId = 'user_cxnp3doa7ozs7ot';
		const users = uchilkaDB.ref('/users/' + userId).once('value').then(function(snapshot) {
		  //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
		  console.log(snapshot.val().coins,'ASHOT!')
		  
		});
		console.log(users,'users--------------')
		}
		//readUsers();


	};
	//fire();
	module.exports = fire;