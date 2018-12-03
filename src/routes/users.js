const express = require('express');
const users = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

// Testing email format
const regex = require('regex-email');

// Password verification
const bcrypt = require('bcryptjs');

// Access token verification
const verifyToken = require('../auth/VerifyToken.js');

// Get a users data
users.get('/me/', verifyToken, (req, res, next) => {
    //app.get('/api/users/:token', verifyToken, (req,res,next) => {
    User.vUserToken(req.userId, (err, user) => {
        if (err) {
            return res.status(500).send({
                message: "There was a problem finding the user."
            });
        } else if (!user) {
            return res.status(404).send({
                message: "No user found."
            });
        } else {
            res.status(200).send(user);
        }
    })

})


// Create a new user
users.post('/', (req, res, next) => {
    const user = req.body;
    const passwordData = bcrypt.hashSync(user.password, 15)
    user.password = passwordData;
    if (regex.test(user.email)) {
    User.addUser(user, (err, user) => {
        if (err) {
            res.status(500).send();
        } else {
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: 86400
            })
            console.log(token);
            res.status(201).send({
                token: token
            });
        }
    })
} else {
    res.status(403).send({message: "Email not a valid email."})
}
});

// Update User
users.put('/me/', verifyToken, (req, res, next) => {
    User.getUserById(req.userId, (err, dbData) => {
        if (err) {
            res.status(404).send();
        } else {
            let user = req.body;
            // Checks if an updated username is provided
            if (req.body.name == null) {
                user.name = dbData.name;
            }
            // Checks if an updated password is provided and if yes uses bcrypt to salt and hash the new password.
            if (req.body.password == null) {
                user.password = dbData.password;
            } else {
                user.password = bcrypt.hashSync(req.body.password, 15)
            }
            // Checks if an updated email is provided
            if (req.body.email == null) {
                user.email = dbData.email;
            } else {
                // Checks if the email provided is in the right format.
                if (!regex.test(req.body.email)) {
                    res.status(403).send()
                }
            }
            // Checks if an updated list of users hobbies is provided
            if (req.body.hobbies == null) {
                user.hobbies = dbData.hobbies
            }
            const options = {
                fields: "fields"
            };
            User.updateUser(req.userId, user, (err, user) => {
                if (err) {
                    res.status(500).send();
                } else {
                    res.status(200).send(user);
                }
            }, options)
        }
    })
})

// Delete User
users.delete('/me/', verifyToken, (req, res, next) => {
    const id = req.userId;
    User.deleteUser(id, (err, user) => {
        if (err) {
            res.status(500).send()
        } else {
            res.status(200).send(user);
        }
    })
})

// Validate User
users.post('/login/', (req, res, next) => {
    const login = req.body;
    User.validateUser(login, (err, user) => {
        if (err) return res.status(500).send({
            message: "Error on the server."
        });
        if (!user) return res.status(404).send({
            message: "No user found with that email. Check it or register."
        });

        const passwordCheck = bcrypt.compareSync(login.password, user.password)
        if (!passwordCheck) {
            res.status(401).send({
                message: "Your password was wrong"
            });
        } else {
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({
                token: token
                /*
                'username':user.name,
                'email':user.email,
                'hobbies':user.hobbies
                */
            });
        }
    })
})

module.exports = users;