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


		// ЗАПИСЬ НОВОГО ЮЗЕРА В БД
		function addUser(name, email, pwd, secret, coins) {
			let teacher = false;
			let newUser = 0; //костыль
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
			try{
				const newUser = uchilkaDB.ref('users/' + userId).set({
					name,
					email,
					pwd,
					teacher,
					coins
				});
				console.log(newUser, 'addUser suckcess');
			} catch (error) {
				console.log('addUser failed');
			}
			return newUser;
		}
		//addUser('Maria Ivanovna', 'teacher@mail.ru', 123123, 'ya_uchilka', 9999999);
		//addUser('Gennadiy', 'g@mail.ru', 123123, 'secret', 500);


		// ОБНОВЛЕНИЕ ЮЗЕРА В БД
		async function updateUser(userId, name, email, pwd, secret, coins) {
			const teacher = false;
			let updatedUser = 0; //костыль
			if (secret == 'ya_uchilka') {
				teacher = true;
			};
			try{
				await uchilkaDB.ref('users/' + userId).set({ //TODO: сделать update а не set
					name,
					email,
					pwd,
					teacher,
					coins
				});
				console.log(userId, 'updateUser suckcess');
			} catch (error){
				console.log(error, 'updateUser failed');
			}
			return userId;
		}
		//updateUser('user_3q5shnlak6a1gyz', 'Oleg', 'ol@mail.ru', '123123', 'secret', 150);


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
				let updatedCoins = 0; //костыль
				try{
					const userCoins = await uchilkaDB.ref('/users/' + userId).once('value');
					let coins = userCoins.val().coins + coinsss;
					updatedCoins = await uchilkaDB.ref('users/' + userId).update({
						coins
					});
					console.log('updateUserCoins suckcess, ' +userId+ ' have ' + coins + ' now');
				} catch(error) {
					console.log(error, 'updateUserStatus failed');
				}
				return updatedCoins;
			}
		}	
		//updateUserCoins('user_3q5shnlak6a1gyz', 'ya_uchilka', 5000); 


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
				try{
					const updatedStatus = await uchilkaDB.ref('users/' + userId).update({
						status:userStatus
					});
					console.log('updateUserStatus suckcess, ' + latestUserStatus + ' now');
				} catch (error){
					console.log(error, 'updateUserStatus failed');
				}
				return latestUserStatus;
			}
		}	
		//updateUserStatus('user_3q5shnlak6a1gyz', 'ya_uchilka', 'прогульщик'); 


		// ИЗМЕНИТЬ СОСТОЯНИЕ
		async function updateUserState(userId, state) {
			const now = Math.floor(Date.now() / 1000);
			const userStateQ = await uchilkaDB.ref('/users/' + userId).once('value');
			let userState = userStateQ.val().state;
			if (!userState || userState.length < 3) {userState = {}};
			userState[now] = state;
			const latestState = Math.max.apply(Math, Object.keys(userState));
			const latestUserState = JSON.stringify({[userId] : userState[latestState]});
			try{
				const updatedState = await uchilkaDB.ref('users/' + userId).update({
					state:userState
				});
				console.log('updateUserState suckcess, ' + latestUserState + ' now');
			} catch (error){
				console.log(error, 'updateUserState failed');
			}
				return latestUserState;
		}	
		//updateUserState('user_3q5shnlak6a1gyz', 'ответил ДА');


		// ОТОЙТИ С ПРЕДУПРЕЖДЕНИЕМ
		async function updateUserAway(userId) {
			const now = Math.floor(Date.now() / 1000);
			const updatedUserAway = JSON.stringify({[userId] : [now]});
			updateUserState(userId, 'отошел с предупреждением');
			setTimeout(updateUserState, 10000, 'отошел без предупреждения');
			try{
				const updatedAway = await uchilkaDB.ref('users/' + userId).update({
					away_from:now
				});
				console.log('updateUserAway suckcess, ' + updatedUserAway + ' now');
			} catch(error){
				console.log(error, 'updateUserAway failed');
			}
			return updatedUserAway;
		}	
		//updateUserAway('user_3q5shnlak6a1gyz');


		// ВЕРНУТЬСЯ
		async function updateUserArrive(userId) {
			const now = Math.floor(Date.now() / 1000);
			const updatedUserArrive = JSON.stringify({[userId] : [now]});
			updateUserState(userId, 'на месте');
			try{
				const updatedArrive = await uchilkaDB.ref('users/' + userId).update({
					away_from:null
				});
				console.log('updateUserArrive suckcess, ' + updatedUserArrive + ' now');
			} catch(error) {
				console.log(error, 'updateUserArrive failed');
			}
			//console.log(updatedUserArrive);
			return updatedUserArrive;
		}	
		//updateUserArrive('user_3q5shnlak6a1gyz');

	};
	//fire();
	module.exports = fire;