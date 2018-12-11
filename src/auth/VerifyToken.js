const jwt = require('jsonwebtoken');

//This code checks if a request header with the name 'hobotti-access-token'
//is given, checks it and if a fault is detected sends an appropriate response.
//If no faults are detected, program moves to on to the next()

function verifyToken(req, res, next) {
    const token = req.headers['hobotti-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No access token provided.' });
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;