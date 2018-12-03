function APIKeyCheck(req, res, next) {
    try{
    const keyToCheck = req.headers['hobotti-api-key'];
    if (!keyToCheck)
    {
        return res.status(463).send({message:'No API key provided'});
    } else if (keyToCheck === process.env.API_KEY) {
        next();
    } else {
        return res.status(464).send({message:'Provided API key not valid.'})
    }
}
catch(err) {
    console.log(Date.now + err)
    return res.status(560);
}
}
module.exports = APIKeyCheck;