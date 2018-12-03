const express = require('express');
const images = express.Router();

images.get('/', (req, res, next) => {
    express.static('img')
});

module.exports = images;