const mongoose = require('mongoose');

// Hobby Schema
const hobbySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    ODid:{
        type: String
    },

    img:{
        type: String
    },

    create_date:{
        type: Date,
        default: Date.now
    }
});

const Hobby = module.exports = mongoose.model('Hobby', hobbySchema);

// Get Hobbies
module.exports.getHobbies = function(callback, limit) {
    Hobby.find(callback).limit(limit);
}

// Add Hobbies
module.exports.addHobby = function(hobby, callback) {
    Hobby.create(hobby, callback);
}

//Update Hobbies
module.exports.updateHobby = function(id, hobby, options, callback) {
    const query = {_id: id};
    const update = {
        name: hobby.name,
        ODid: hobby.ODid,
        img: hobby.img
    }
    Hobby.findOneAndUpdate(query, update, options, hobby, callback);
}