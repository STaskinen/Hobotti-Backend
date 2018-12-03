const mongoose = require('mongoose');

const hobbyList =
[
    {
        name:"Musiikki",
        url:"hobotti-backend-testing.herokuapp.com/images/Musiikki.jpg"},
    {
        name:"Taide",
        url:"hobotti-backend-testing.herokuapp.com/images/Taide.jpg"},
    {
        name:"Teatteri",
        url:"hobotti-backend-testing.herokuapp.com/images/Teatteri.jpg"},
    {
        name:"Kulttuuri",
        url:"hobotti-backend-testing.herokuapp.com/images/Kulttuuri.jpg"},
    {
        name:"Tanssi",
        url:"hobotti-backend-testing.herokuapp.com/images/Tanssi.jpg"
    }
]

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
    //Hobby.find(callback).limit(limit);

    callback(hobbyList);
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