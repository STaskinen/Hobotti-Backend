require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const randomstring = require("randomstring");

const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const swaggerDocument = require('./openapi2.json');
//const swaggerJSDoc = require('swagger-jsdoc');

// Helsinki Open APIs
const HelData = require('./src/hel.js');

// Authorization files
//const authConfig = require('./config.js');
//const authConfig = require('./src/trueconfig.js');
const verifyToken = require('./src/auth/VerifyToken.js');
const keyChecker = require('./src/auth/keyChecker.js')

// Routing
const hobbiesRouter = require('./src/routes/hobbies.js');
const userRouter = require('./src/routes/users.js');
const eventsRouter = require('./src/routes/events.js');
const chatLogsRouter = require('./src/routes/chatLogs.js');
const imageRouter = require('./src/routes/images.js')

// MongoDB/mLab Login Credentials
const dbc = require('./dbconfig.json');


const app = express();
const server  = require('http').createServer(app);

app.use(bodyParser.json());

//COnnecting to Mongoose
//mongoose.connect('mongodb://localhost/hobotti');
mongoose.connect('mongodb://' + dbc.mongoUser + ':' + dbc.dbpassword + '@ds259742.mlab.com:59742/heroku_z33wwwf1');
const db = mongoose.connection

//const swaggerOptions = require('./swagger-config.json');
//const swaggerSpec = swaggerJSDoc(swaggerOptions);


// Swagger gets
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Landing "page"
app.get('/', (req, res, next) => {
    //res.send('Please go to /api-docs for the Swagger page');
    res.redirect('/api-docs');
});

let path = require('path');

app.use('/api/hobby/',keyChecker, hobbiesRouter);
app.use('/api/users/', keyChecker, userRouter);
app.use('/api/events', keyChecker, eventsRouter);
app.use('/chat',express.static(path.join(__dirname, '/public')));
app.use('/api/logs/', keyChecker, chatLogsRouter);
app.use('/images',express.static('img'));


const io = require('./src/chatserver').listen(server); //listen(server, sess)

const port = process.env.PORT || 3000;
server.listen(port, () => {
    process.on('SIGTERM', () => {
        server.close(async () => {
            await Promise.all([mongoose.connection.close(), client.quit()]);
            process.kill();
        });
    });
});