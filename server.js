const express = require('express');
const env = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const config = require('./config/config');
const logger = require('./utils/logger');
const dbConnect = require('./config/dbConfig');

// initialize express application
const app = express();

// accessing .env variables
env.config();



// middleware

// body-parser for accessing post req data
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
}));
app.use(bodyParser.json({
    limit: '10mb'
}));


// use helmet to secure Express headers
app.use(helmet({
    frameguard: {
        action: 'deny'
    }
}));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.noCache());
app.disable('x-powered-by');

app.use(function(req, res, next) {
    var oneof = false;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


let isWhitelist = (req) => {
    return (req.path.indexOf("/favicon.ico") > -1 || req.path.indexOf("/auth/") > -1 || req.path.indexOf("/api/auth/") > -1 || req.path.indexOf("/api/auth/forgot") > -1 || req.path.indexOf("/api/auth/reset") > -1 || req.path.indexOf("/api/public") > -1) || req.path.indexOf("/api/user/register") > -1
}

// checking authenticated routes and public routes 
app.use(function(req, res, next) {
    console.log("----------==========-------------");
    var authToken = req.headers.authorization;
    if (authToken) {
        logger.debug("-----auth reruired route------");
        res.json({
            message: "auth token required"
        });
    } else if (isWhitelist(req)) {
        logger.debug("-----public route------");
        next();
    } else {
        res.status(401).send('Not authorized to access this resource');
    }
});

// bind all routes to express app
config.getGlobbedFiles('./app/**/routes/**/*.js').forEach(function(routePath) {
    console.log("path.resolve(routePath)", path.resolve(routePath));
    require(path.resolve(routePath))(app);
});

// connect to database
dbConnect.initConnection().then((dbConnection) => {
    logger.debug("connected to database successfully");
    global.db = dbConnection;
}).catch((err) => {
    logger.emerg("error while connecting to database: ", err);
});


app.listen(process.env.API_PORT, () => {
    logger.info(`api server up, running at: ${process.env.API_PORT}`)
});



// const router = require('./routes/route');

// const app = express();
// env.config();

// // set connection options
// const connectionOptions = {
//     dbName: process.env.DB_NAME,
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//     autoIndex: false, // Don't build indexes
//     poolSize: 10, // Maintain up to 10 socket connections
//     // If not connected, return errors immediately rather than waiting for reconnect
//     bufferMaxEntries: 0,
//     connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
//     socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//     family: 4 // Use IPv4, skip trying IPv6
// };

// // conect to mongo database
// mongoose.connect(process.env.DB_CONNECT, connectionOptions, () => {
//     console.log("connect to db");
// });

// // middleware 
// app.use('/static', express.static(path.join(__dirname, 'public')))
// app.use(helmet());
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
// // parse application/json
// app.use(bodyParser.json());

// app.use("/api/user", router);

// app.get('/', (req, res) => {
//     res.json({ "text": "hello-world" })
// });

// app.listen(process.env.API_PORT, () => {
//     console.log("api server up, running at:", process.env.API_PORT)
// });