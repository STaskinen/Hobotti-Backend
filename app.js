const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
//const swaggerJSDoc = require('swagger-jsdoc');


// Getting data models
const Hobby = require('./models/hobby.js');
const User = require('./models/user.js');
const SpoMo = require('./models/spomo.js');

// Helsinki Open APIs
const HelData = require('./src/hel.js');

// Authorization files
const authConfig = require('./config.js');
//const authConfig = require('./trueconfig.js');
const verifyToken = require('./VerifyToken.js');

// MongoDB/mLab Login Credentials
const dbc = require('./dbconfig.json');

/*
 generates random string of characters i.e salt
 @function
 @param {number} length - Length of the random string.
 

let saltStringGen = function(length) {
    return crypto.randomBytes(Math.ceil(length/2))
       .toString('hex')
       .slice(0,length);
   };
  
    hash password with sha512.
    @function
    @param {string} password - List of required fields.
    @param {string} salt - Data to be validated.
    
   let sha512 = function(password, salt){
       let hash = crypto.createHmac('sha512', salt);
       hash.update(password);
       const value = hash.digest('hex');
       return {
           salt:salt,
           passwordHash:value
       };
   };*/
 
const app = express();

app.use(bodyParser.json());

//COnnecting to Mongoose
//mongoose.connect('mongodb://localhost/hobotti');
mongoose.connect('mongodb://'+ dbc.mongoUser + ':' + dbc.dbpassword + '@ds259742.mlab.com:59742/heroku_z33wwwf1');
const db = mongoose.connection

//const swaggerOptions = require('./swagger-config.json');
//const swaggerSpec = swaggerJSDoc(swaggerOptions);


// Swagger gets
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Landing "page"
app.get('/', (req, res, next) => {
    res.send('Please go to /api-docs for the Swagger page');
});

app.get('/api/hobby', (req, res, next) => {
    Hobby.getHobbies((hobbies) => { 
        /* if(err){
            throw err;
        } */
        res.status(200).send({hobbies});
    })
});

/*
// Get a list of all the hobbies


// Create a hobby
app.post('/api/hobbies', (req, res, next) => {
    const hobby = req.body;
    Hobby.addHobby(hobby, (err, hobby) => {
        if(err){
            throw err;
        }
        res.json(hobby);
    } )
})

app.put('/api/hobbies/:id', (req, res, next) => {
    const id = req.params.id;
    const hobby = req.body;
    const options = {empty:'this is'};
    Hobby.updateHobby(id, hobby, (err, hobby) => {
        if(err){
            throw err;
        }
        res.json(hobby);
    }, options )
})
*/
// USERS
// Get a list of all users

app.get('/api/users/me', verifyToken, (req,res,next) => {
//app.get('/api/users/:token', verifyToken, (req,res,next) => {
        User.vUserToken(req.userId, (err, user) => {
            if (err) return res.status(500).send({message: "There was a problem finding the user."});
            
            if (!user) return res.status(404).send({message: "No user found."})

            res.status(200).send(user);
        })
})

// Create a new user
app.post('/api/users', (req, res, next) => {
    const user = req.body;
    const passwordData = bcrypt.hashSync(user.password, 15)
    user.password = passwordData;
    User.addUser(user, (err, user) => {
        if(err){
            throw err;
        }
        const token = jwt.sign({ id:user._id}, authConfig.secret, {expiresIn: 86400})
        console.log(token);
        res.status(200).send({auth: true, token: token});
    } )
});

// Update User
app.put('/api/users/me', verifyToken, (req, res, next) => {
    User.getUserById(req.userId, (err, dbData) => {
        if(err){
            throw err;
        }
        let user = req.body;
        if (req.body.name == null) {
            user.name = dbData.name;
        }
        if (req.body.password == null) {
            user.password = dbData.password;
        } else {
            user.password = bcrypt.hashSync(req.body.password, 15)
        }
        if (req.body.email == null) {
            user.email = dbData.email;
        }
        if (req.body.hobbies == null) {
            user.hobbies = dbData.hobbies
        }
        const options = {fields:"fields"};
    User.updateUser(req.userId, user, (err, user) => {
        if(err){
            throw err;
        }
        res.status(200).send({"message":"Update Successful"});
    }, options )
    })
    
    
})

// Delete User
app.delete('/api/users/me', verifyToken, (req, res, next) => {
    const id = req.userId;
    User.deleteUser(id, (err, user) => {
        if(err){
            throw err;
        }
        res.status(200).send({"message":"User Deleted"});
    })
})
// Validate User
app.post('/api/users/login/', (req, res, next) => {
    const login = req.body;
    User.validateUser(login, (err, user) => {
        if (err) return res.status(500).send({message: "Error on the server."});
        if(!user) return res.status(404).send({message:"No user found with that email. Check it or register."});

        const passwordCheck = bcrypt.compareSync(login.password, user.password)
        if(!passwordCheck){
            res.status(401).send({ auth: false,
                token: null,
                message:"Your password was wrong"});
            }
            const token = jwt.sign({id: user._id}, authConfig.secret, {expiresIn: 86400 // expires in 24 hours
            });
        res.status(200).send({auth: true,
            token: token,
            message:"Login successful"
            /*{
            'username':user.name,
            'email':user.email,
            'hobbies':user.hobbies
            */
    });
    })
})

// Linked Events
app.get('/api/events/:keyword', verifyToken, (req, res, next) => {
    HelData.basicSearch(req.params.keyword, (err, data) => {
        if(err){
            res.status(500).send({message: 'Helsinki servers fucked up'});
        }
        HelData.DataSnip(data, (snip) => {
            if(err){
                res.status(500).send({message: "Snipper Malfunction"})
            }
            if(snip.count === 0){
                res.status(404).send({message: "No Events found in Linked Events"})
            }
            res.status(200).send(snip);
        })


        //res.status(200).send(finalData);
    })
})

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    process.on('SIGTERM', () => {
        server.close(async ()=>{
            await Promise.all([mongoose.connection.close(), client.quit()]);
            process.kill();
        });
    });
});