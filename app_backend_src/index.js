//index.js is the main file of Node Application
//Change NODE_ENV from VSCode Terminal : $env:NODE_ENV='development'
//Change NODE_ENV from package.json Script : set NODE_ENV='development' && node index.js

//Module import : Achived using const targetmodule = require('targetmodule')
//Module can consist of a single file or many files in a directory
//Importing single file only need to precise what file
//Importing whole directory need it to have index.js file
//Adding ./module/index.js allow to specify all that needs to be done when Importing using ./module directory
//For Importing directories, refer to https://nodejs.org/api/modules.html#modules_folders_as_modules

//API Routes and Callback are defined in the ./routes directory
//API Routes can have MiddleWares to apply more operations on request and response : refer to https://expressjs.com/en/resources/middleware.html
//API Test are defined in the ../spec directory : Achived using jest.mock(), test() and expect().toBe()

//For simple example app and deploy, refer to https://docs.docker.com/language/nodejs/
//For more detailed simple example with video, refer to https://www.youtube.com/watch?v=9OfL9H6AmhQ
//Alternatively, simple example with no SGBD for Node and Express : https://www.youtube.com/watch?v=l8WPWK9mS5M
//Alternatively, App example with MongoDB for Node and Express : https://www.youtube.com/watch?v=H9M02of22z4
//Here, SGBD are Relational : If considering MongoDB, refer to https://mongoosejs.com/
//Consider Documenting using MoCoDo : https://www.mocodo.net/
//Consider Testing using Postman or Insomnia
//Consider also ThunderClient if wants to keep most in VSCode

//Advanced Syntax : The ... Operator
//Rest Syntax : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
//Spread Syntax : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters

//Advanced Syntax : The {} Operator
//Destructuring Assessment : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

//Imports from Node Modules
//Express is FrameWork for App, allowing some MiddleWares and Routers
//Passport, Strategy and Express-Session are for Auth and Cookies Manadgment
//Strategy Authenticate User using predetermined Strategy : Match Login/Password against DB, Connect to Third Party Account
//Passport rely on Express-Session to maintain the Session in req.session with Cookies
//Helmet is basic security FrameWork : Check for XSS, Hide Headers as PoweredBy
//CORS is Cross Origin Ressource Sharing, for accessing some URL from any other site
//BodyParser is conveinant way to get Body of HTTP POST Request
//DotEnv is Utility for Configuration from an Environment File
//Winston is Logger for Error, Warning and Info
//For Unique ID : Refer to https://www.npmjs.com/package/uuid
const express = require('express');
const express_session = require('express-session');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

//Imports from Project
const passportSet = require('./config/passport-setup.js');
const databaseSequelizeConnexion = require('./database/databaseConnexion.js');
const dbModels = require('./models');
const homeRouter = require('./routes/homeRouter.js');
const authRouter = require('./routes/authRouter.js');
const dashboardRouter = require('./routes/dashboardRouter.js');
const coursesRouter = require('./routes/coursesRouter.js');
const adminRouter = require('./routes/adminRouter.js');
const authMiddleware = require('./middlewares/authMiddleware.js');
const CustomError = require('./config/CustomError.js');
const errorHandler = require('./middlewares/errorHandler.js');

//MiddleWares
//Allow to define intermediate functions called when using the API
//Add MiddleWare : app.use(URL,Callback)
//MiddleWare can access req and res, possibly checking values and modifying them
//MiddleWare with no URL Specified are applied to all URL
//Chaining MiddleWares is done using the next() function, Calling next MiddleWare relevent for requested URL
//For writing MiddleWare, refer to https://expressjs.com/en/guide/writing-middleware.html

//MiddleWare than should be executed at the beginning of each Route
//Express Session : HTTP Session for Logged Client, used to manage Cookies encrypted with Secret and by default with expiration up to the Browser
//Passport put Authenticated User in req.session relying on express-session
//Passport can access the HTTP req and set req.user by calling initialize() then authenticate('session')
//BodyParser.json Parse the Body of Incoming HTTP Request from Clients to JSON Format
//This means Our Server only expect JSON as Client Data
app.use(helmet());
app.use(bodyParser.json());
app.use(express_session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge : 8 * 60 * 60 * 1000
    }
}));
app.use(passportSet.initialize());
app.use(passportSet.authenticate('session'));

//Routes
//Routes need declaration of HTTP Method, URL and Callback
//Callback specify 2 Parameters : req and res
//Parameter req : HTTP Request from Client to Server
//Parameter res : HTTP Response from Server to Client
//To declare HTTP GET : app.get(URL,Callback)
//To declare HTTP POST : app.post(URL,Callback)
//Routes advance MiddleWare chain with next() until Request is Completed by calling either res.send(), res.json()...
//For Completing Request, refer to https://expressjs.com/en/guide/routing.html#response-methods
//Also Router can allow to classify URL : Refer To https://expressjs.com/en/guide/routing.html
//Using Router.route(URL) all HTTP Methods (GET, POST, PUT and DELETE) can be sepcified

//Routes for HomePage
app.use('/',homeRouter);
//Routes for Authentication
app.use('/auth',authRouter);
//Routes for User Dashboard
app.use('/dashboard',dashboardRouter);
//Routes for Courses
app.use('/courses',coursesRouter);
//Routes for Admin
app.use('/admin',adminRouter);
//Routes 404 Page
app.use('*', (req,res,next) => {
    return next(CustomError.notFound("Error : Page Not Found"));
})

//MIddleWare for Error
app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 4000;
//Starting API Server
app.listen(PORT, () => {
    console.log(`Node API Running On http://localhost:${PORT}`);
});

//Authentification : https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5
//Local/JWT : https://www.youtube.com/playlist?list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK
//OAuth : https://www.youtube.com/playlist?list=PL4cUxeGkcC9jdm7QX143aMLAqyM-jTZ2x
//Tutorial NODE : https://www.youtube.com/watch?v=Oe421EPjeBE
//TypeScript IS Better : https://github.com/ljlm0402/typescript-express-starter

//Passport and Strategy are used for Session and Authentication
//Passport help the already Authenticated User use a Session with the Server
//Strategy help Authenticate the User

//Passport is Initialized for all routes as the function passport.deserialiseUser() use Cookie previously sent to Client in order put data in req.user

//req.isAuthenticated() check if User alread Loged by passport.authenticate() and so field req.session.passport.user is defined

//passport.serializeUser() is called by done() of Strategy Authenticate Function used in passport.authenticate() and Add User Object with the Serialized Properties to req.session.passport.user
//passport.serializeUser() creates a Field passport in the Cookie that is sent diretly to the Client by calling done(null,Object)

//passport.deserializeUser() is called when querying any route and place content of req.session.passport.user in req.user if there is User Connected
//passport.deserializeUser() check Cookie received from Client and get data with Cookie Session ID

//Using serialize and deserialize allow Cookie to travel with Our User Info Server>Client then Client>Server

//Read File : https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs
//Read Image : https://gist.github.com/MarkoCen/0ee9437439e00e313926

//TODO : Add Utility to check parameters type and cast or throw error as necessary
