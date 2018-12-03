const jwt = require('jsonwebtoken');
//const authConfig = require('./config');
//const authConfig = require('./trueconfig');


function verifyToken(req, res, next) {
    //const token = req.params.token;
    const token = req.headers['hobotti-access-token'];
  if (!token)
    return res.status(473).send({ auth: false, message: 'No access token provided.' });
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err)
    return res.status(570).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;