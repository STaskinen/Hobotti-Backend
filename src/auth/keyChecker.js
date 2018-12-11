// This code checks if a request header with the name 'hobotti-api-key'
// is given, checks it and if not faults are detected the program continues
// forward.
// If faults or errors are detected, an appropriate response is send to the
// client.

function APIKeyCheck(req, res, next) {
    try{
    const keyToCheck = req.headers['hobotti-api-key'];
    if (!keyToCheck)
    {
        return res.status(403).send({message:'No API key provided'});
    } else if (keyToCheck === process.env.API_KEY) {
        next();
    } else {
        return res.status(404).send({message:'Provided API key not valid.'})
    }
}
catch(err) {
    console.log(Date.now + err)
    return res.status(500);
}
}
module.exports = APIKeyCheck;