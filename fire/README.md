
## листенеры
handleServerMessage - глобавльный листнер, показывает всё что происходит  
connListener - показывает всех подключившихся к бд  



## методы

### addUser
записывает нового юзера  
принимает: name, email, pwd, secret, coins  
возвращяет: json с новым юзером : {"user_3jn5k6df9ajdevx":{"coins":150,"email":"le@mail.ru","name":"Lena","pwd":123123,"teacher":false}  

### loginUser
проверяет логин и пароль юзера  
принимает: email, pwd  
возвращяет: boolean : "true"  

### getUsers
получает из БД список юзеров 
принимает:  
возвращяет: json со всеми юзерами : {"user_6am0979eykqw4cc": {"...":"..."},"user_3jn5k6df9ajdevx": {"...":"..."}}  

### getUsersState (B)
получает из БД состояния всех юзеров
принимает:  
возвращяет: json со всеми юзерами : {"user_6am0979eykqw4cc": "отошел","user_3jn5k6df9ajdevx": "поднимает руку"} 

### updateUser
изменяет данные юзера  
принимает: userId, name, email, pwd, secret, coins  
возвращяет: userId измененного юзера : "user_3jn5k6df9ajdevx" 

### updateUserState
изменяет состояние ученика  
принимает: userId, state  
возвращяет: json с userId и новым состоянием : {"user_6am0979eykqw4cc":"away"}  

### updateUserState
изменяет статус ученика  
принимает: userId, secret, status  
возвращяет: json с userId и новым статусом : {"user_6am0979eykqw4cc":"raspezdol"}  

### updateUserCoins
изменяет кол-во монет у ученика  
принимает: userId, secret, coins  
возвращяет: json с userId и новым кол-вом монет : {"user_6am0979eykqw4cc":-4500}  

### updateUserAway
добавляет поле away_from выбранному юзеру, меняет состояние на "отошел с предупреждением" и запускает таймер. после таймера меняет состояние на "отошел без предупреждения"  
принимает: userId  
возвращяет: json с userId и временем отлучения : {"user_6am0979eykqw4cc": 1588589145}  

### updateUserArrive
удаляет поле away_from выбранному юзеру, меняет состояние на "на месте"  
принимает: userId  
возвращяет: json с userId и новым состоянием : {"user_6am0979eykqw4cc":"на месте"}  