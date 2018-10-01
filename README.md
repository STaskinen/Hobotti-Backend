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
and if successful at creating/adding the account, returns the it's data back.

### "Login"
The login uses the /users/login endpoint and takes in a json object of the users email and password like so
```json
{
	"email":"email@mail.com",
	"password":"Passwording"
}
```
and if the inputted password matches the one in the database the users data is returned. If they do not match, server returns a json
```json
{
validation:"Either your email or password was wrong"
}
```
which is likely to be changed later in development.
