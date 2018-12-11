const mongoose = require('mongoose');

// Basic backbone for the once planned Spontaneus events.
// Most likely never to be implemented.

// Spontaneous Moment/Event Schema
const spomoSchema = mongoose.Schema({
    creator:{
        type: String,
        required: true
    },

    hobby:{
        type: String,
        required: true
    },

    location:{
        type: String,
        required: true
    },

    desc:{
        type: String,
        required: true
    },
    
    creation_time:{
        type: Date,
        required: true
    }
});

const SpoMo = module.exports = mongoose.model('SpoMo', spomoSchema);

// Get Spontaneous Moments
module.exports.getSpoMos = function(callback, limit) {
    SpoMo.find(callback).limit(limit);
}

// Get Spontaneous Moments by id
module.exports.getSpoMoById = function(Id, callback) {
    SpoMo.findById(Id, callback).limit();
}

// Add a Spontaneous Moment
module.exports.addSpoMo = function(spomo, callback) {
    SpoMo.create(spomo, callback);
}