const mongoose = require('mongoose');

// List of hobbies used by the client app.
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
        url:"hobotti-backend-testing.herokuapp.com/images/Tanssi.jpg"},    
    {
        name:"Luonto",
        url:"hobotti-backend-testing.herokuapp.com/images/Taide.jpg"},
    {
        name:"Jumppa",
        url:"hobotti-backend-testing.herokuapp.com/images/Taide.jpg"},
    {
        name:"Elokuva",
        url:"hobotti-backend-testing.herokuapp.com/images/Teatteri.jpg"},
    {
        name:"Kirjallisuus",
        url:"hobotti-backend-testing.herokuapp.com/images/Kulttuuri.jpg"},
    {
        name:"Ooppera",
        url:"hobotti-backend-testing.herokuapp.com/images/Tanssi.jpg"},
    {
        name:"Sarjakuva",
        url:"hobotti-backend-testing.herokuapp.com/images/Musiikki.jpg"},
    {
        name:"Joulu",
        url:"hobotti-backend-testing.herokuapp.com/images/Taide.jpg"},
    {
        name:"Askartelu",
        url:"hobotti-backend-testing.herokuapp.com/images/Teatteri.jpg"},
    {
        name:"Pelit",
        url:"hobotti-backend-testing.herokuapp.com/images/Kulttuuri.jpg"},
    {
        name:"Juokseminen",
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

// Add Hobbies (Unused)
module.exports.addHobby = function(hobby, callback) {
    Hobby.create(hobby, callback);
}

//Update Hobbies (Unused)
module.exports.updateHobby = function(id, hobby, options, callback) {
    const query = {_id: id};
    const update = {
        name: hobby.name,
        ODid: hobby.ODid,
        img: hobby.img
    }
    Hobby.findOneAndUpdate(query, update, options, hobby, callback);
}