require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

//
const mongoose = require('mongoose');

// Files and packages for the Swagger/OpenAPI page
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi2.json');

// Scripts for the authorization of API and Access keys
const verifyToken = require('./src/auth/VerifyToken.js');
const keyChecker = require('./src/auth/keyChecker.js')

// Express Router Routing files
const hobbiesRouter = require('./src/routes/hobbies.js');
const userRouter = require('./src/routes/users.js');
const eventsRouter = require('./src/routes/events.js');
const chatLogsRouter = require('./src/routes/chatLogs.js');
const imageRouter = require('./src/routes/images.js')


//Start of the app
const app = express();
const server  = require('http').createServer(app);

app.use(bodyParser.json());

//Connecting to the MongoDB database via Mongoose
mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds259742.mlab.com:59742/heroku_z33wwwf1');
const db = mongoose.connection

//Redirection from root to the Swagger page
app.get('/', (req, res, next) => {
    //res.send('Please go to /api-docs for the Swagger page');
    res.redirect('/api-docs');
});

// Route to host the Swagger/OpenAPI page
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let path = require('path');

//Express routing routes for the different endpoints
app.use('/api/hobby/',keyChecker, hobbiesRouter);
app.use('/api/users/', keyChecker, userRouter);
app.use('/api/events', keyChecker, eventsRouter);
app.use('/chat',express.static(path.join(__dirname, '/public')));
app.use('/api/logs/', keyChecker, chatLogsRouter);
app.use('/images',express.static('img'));

//Setting up of the Socket.io chat server
const io = require('./src/chatserver').listen(server); //listen(server, sess)

const port = process.env.PORT || 3000;

//Setting up of the main server
server.listen(port, () => {
    process.on('SIGTERM', () => {
        server.close(async () => {
            await Promise.all([mongoose.connection.close(), client.quit()]);
            process.kill();
        });
    });
});