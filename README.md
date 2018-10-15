# Hobotti-Backend

API Base URL:
[https://hobotti-backend-testing.herokuapp.com/api/](https://hobotti-backend-testing.herokuapp.com/api/)

## Main POST methods
### Registration
The registration uses the **/users** endpoint, taking in a json object that follows the following structure
```json
{
	"name":"Username",
	"email":"email@mail.com",
	"password":"Passwording",
	"hobbies":["hobby1", "hobby2"]
}
```
with the email and password fields being required at this moment.

If the server is successful at creating/adding the account, the server generates and sends back a json with an access token
```json
{
    "auth": true,
    "token": "token-be-here"
}
```

where we can see that the server has generated a salt and stored it and a hash generated using that salt and the given password with rest of the user data.
*At this time the only data required to get through the login are just the email and password fields.*

### Login
The login uses the **/users/login** endpoint and takes in a json object of the users email and password like so
```json
{
	"email":"email@mail.com",
	"password":"Passwording"
}
```
and if the inputted password matches the one in the database a json containing the authorization state and access token is returned
```json
{
    "auth": true,
    "token": "token-be-here",
    "message": "Login successful"
}
```

If the passwords do not match then the server returns this json
```json
{"message":"Your password was wrong"}
```
If the the inputted email can't be found in the database the server returns
```json
{"message":"No user found with that email. Check it or register"}
```
These messages might get changed in the future.

###GET user info

User's information can be obtained from the server by sending a GET request to the **/users/me** endpoint with a header with the key name of "hobotti-access-token" without the quotes and the value of the token string gotten from a successful login or registration.
If the provided access token is valid, the server returns a json with the users name, email, hobbies and creation date.
```json
{
    "hobbies": [
        "football",
        "hockey",
        "tennis"
    ],
    "name": "Testing Tommy",
    "email": "Testing.Tommy@gmail.com",
    "create_date": "2018-10-14T15:50:38.001Z"
}
```
Otherwise it returns
```json
{
    "auth": false,
    "message": "Failed to authenticate token."
}
```

