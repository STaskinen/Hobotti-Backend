const express = require('express');
const hobbies = express.Router();
const Hobby = require('../models/hobby.js');

hobbies.get('/', (req, res, next) => {
    Hobby.getHobbies((hobbies) => {
            res.status(200).send({
                hobbies
            });
    })
});

module.exports = hobbies;