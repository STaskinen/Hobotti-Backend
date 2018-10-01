const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');


// Getting data models
const Hobby = require('./models/hobby.js');
const User = require('./models/user.js');
const SpoMo = require('./models/spomo.js');

/*
 generates random string of characters i.e salt
 @function
 @param {number} length - Length of the random string.
 */

let saltStringGen = function(length) {
    return crypto.randomBytes(Math.ceil(length/2))
       .toString('hex')
       .slice(0,length);
   };
   /*
    hash password with sha512.
    @function
    @param {string} password - List of required fields.
    @param {string} salt - Data to be validated.
    */
   let sha512 = function(password, salt){
       let hash = crypto.createHmac('sha512', salt);
       hash.update(password);
       const value = hash.digest('hex');
       return {
           salt:salt,
           passwordHash:value
       };
   };


const mongoUser = "backendUser";
const dbpassword = "perunakovalevyapinalelu12345"   
const app = express();

app.use(bodyParser.json());

//COnnecting to Mongoose
mongoose.connect('mongodb://'+ mongoUser + ':' + dbpassword + '@ds259742.mlab.com:59742/heroku_z33wwwf1');
const db = mongoose.connection

//Landing "page"
app.get('/', (req, res, next) => {
    res.send('Please use /api/users endpoint');
});


// Get a list of all the hobbies
app.get('/api/hobbies', (req, res, next) => {
    Hobby.getHobbies((err, hobbies) => { 
        if(err){
            throw err;
        }
        res.json(hobbies);
    })
});

// Create a hobby
app.post('/api/hobbies', (req, res, next) => {
    const hobby = req.body;
    Hobby.addHobby(hobby, (err, hobby) => {
        if(err){
            throw err;
        }
        res.json(hobby);
    } )
})

app.put('/api/hobbies/:id', (req, res, next) => {
    const id = req.params.id;
    const hobby = req.body;
    const options = {empty:'this is'};
    Hobby.updateHobby(id, hobby, (err, hobby) => {
        if(err){
            throw err;
        }
        res.json(hobby);
    }, options )
})

// USERS
// Get a list of all users
app.get('/api/users', (req, res, next) => {
    User.getUsers((err, users) => { 
        if(err){
            throw err;
        }
        res.json(users);
    })
})

//Get a user by the id assigned by MongoDB
app.get('/api/users/:_id', (req, res, next) => {
    User.getUsersById(req.params._id, (err, users) => { 
        if(err){
            throw err;
        }
        res.json(users);
    })
})

// Create a new user
app.post('/api/users', (req, res, next) => {
    const user = req.body;
    const salt = saltStringGen(32);
    const passwordData = sha512(user.password, salt);
    user.password = passwordData.passwordHash;
    user.salt = passwordData.salt;
    User.addUser(user, (err, user) => {
        if(err){
            throw err;
        }
        res.json(user);
    } )
});

// Update User
app.put('/api/users/:id', (req, res, next) => {
    const id = req.params.id;
    const user = req.body;
    const options = {empty:'this is'};
    User.updateUser(id, user, (err, user) => {
        if(err){
            throw err;
        }
        res.json(user);
    }, options )
})

// Delete User
app.delete('/api/users/:id', (req, res, next) => {
    const id = req.params.id;
    User.deleteUser(id, (err, user) => {
        if(err){
            throw err;
        }
        res.json(user);
    })
})
// Validate User
app.post('/api/users/login/', (req, res, next) => {
    const login = req.body;
    User.validateUser(login, (err, user) => {
        if(err){
            throw err;
        }
        const salt = user.salt;
        const passwordHashDB = user.password;
        const tempHash = sha512(login.password, salt);
        const passwordHashLogin = tempHash.passwordHash;
        if(passwordHashDB === passwordHashLogin){
        res.json(user);
        } else {
            res.json({validation:"Failed"})
        }
    })
})

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    process.on('SIGTERM', () => {
        server.close(async ()=>{
            await Promise.all([mongoose.connection.close(), client.quit()]);
            process.kill();
        });
    });
});