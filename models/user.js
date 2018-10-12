const mongoose = require('mongoose');





// User Schema
const userSchema = mongoose.Schema({
    name:{
        type: String
    },

    email:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    salt:{
        type: String
    },

    hobbies:{
        type: Array
    },
    
    create_date:{
        type: Date,
        default: Date.now
    }
});

const User = module.exports = mongoose.model('User', userSchema);

// Get Users
module.exports.getUsers = function(callback, limit) {
    User.find(callback).limit(limit);
}

// Get Users by ID
module.exports.getUsersById = function(userId, callback) {
    User.findById(userId, callback).limit();
}

// Add a user
module.exports.addUser = function(user, callback) {
    User.create(user, callback);
}

// Update User
module.exports.updateUser = function(id, user, options, callback) {
    const query = {_id: id};
    const update = {
        name: user.name,
        email: user.email,
        password: user.password,
        hobbies: user.hobbies
    }
    User.findOneAndUpdate(query, update, options, user, callback);
}

// Validate User
module.exports.validateUser = function(login, callback) {
    User.findOne({email: login.email}, callback);
}

// Validate User Token
module.exports.vUserToken = function(id, callback) {
    User.findById(id, {password: 0, _id: 0, __v: 0}, callback);
}

// Delete User
module.exports.deleteUser = function(id, callback) {
    const query = {_id: id};
    User.deleteOne(query, callback);
}