# Hobotti-Backend

API Base URL:
[https://hobotti-backend-testing.herokuapp.com/api/](https://hobotti-backend-testing.herokuapp.com/api/)

## Main POST methods
### Registration
The registration uses the /users/ endpoint, taking in a json object that follows the following structure
```json
{
	"name":"Username",
	"email":"email@mail.com",
	"password":"Passwording",
	"hobbies":["hobby1", "hobby2"]
}
```
and if successful at creating/adding the account, returns the it's data like so 
```json
{
    "hobbies": [
        "hobby1",
        "hobby2"
    ],
    "_id": "5bb23441c364610015e24f37",
    "name": "Username",
    "email": "email@mail.com",
    "password": "1e23ee4e08f43a6e2e67ca0cb5403cfa49219032c8deef79afe1d17dc3a827c49278081ad4502d70795d305497182d1a67899c0b58bc7b4d9d92649be8d01a91",
    "salt": "74d6fd710c54295bb0a157f3111596e4",
    "create_date": "2018-10-01T14:50:41.012Z",
    "__v": 0
}
```

where we can see that the server has generated a salt and stored it and a hash generated using that salt and the given password with rest of the user data.
*At this time the only data required to get through the login are just the email and password fields.*

### "Login"
The login uses the /users/login endpoint and takes in a json object of the users email and password like so
```json
{
	"email":"email@mail.com",
	"password":"Passwording"
}
```
and if the inputted password matches the one in the database the users data is returned like so
```json
{
    "hobbies": [
        "hobby1",
        "hobby2"
    ],
    "_id": "5bb23441c364610015e24f37",
    "name": "Username",
    "email": "email@mail.com",
    "password": "1e23ee4e08f43a6e2e67ca0cb5403cfa49219032c8deef79afe1d17dc3a827c49278081ad4502d70795d305497182d1a67899c0b58bc7b4d9d92649be8d01a91",
    "salt": "74d6fd710c54295bb0a157f3111596e4",
    "create_date": "2018-10-01T14:50:41.012Z",
    "__v": 0
}
```

If the passwords do not match then the server returns this json
```json
{"validation":"Your password was wrong"}
```
If the the inputted email can't be found in the database the server returns
```json
{"validation":"Your email was wrong"}
```
These messages might get changed in the future.
