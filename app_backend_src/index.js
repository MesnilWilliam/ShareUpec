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
//Express is FrameWork for App, quite some MiddleWares and Routers
//CORS is Cross Origin Ressource Sharing, for accessing some URL from any other site
//BodyParser is conveinant way to get Body of HTTP POST Request
//DotEnv is Utility for Configuration from an Environment File
//Winston is Logger for Error, Warning and Info
//For Unique ID : Refer to https://www.npmjs.com/package/uuid
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

//Imports from Project
const databaseSequelizeConnexion = require('./database/databaseConnexion.js');
const UserModel = require('./models/UserModel.js');
const homeRouter = require('./routes/homeRouter.js');
const usersRouter = require('./routes/usersRouter.js');
const errorHandler = require('./middlewares/errorHandler.js');

//MiddleWares
//Allow to define intermediate functions called when using the API
//Add MiddleWare : app.use(URL,Callback)
//MiddleWare can access req and res, possibly checking values and modifying them
//MiddleWare with no URL Specified are applied to all URL
//Chaining MiddleWares is done using the next() function, Calling next MiddleWare relevent for requested URL
//For writing MiddleWare, refer to https://expressjs.com/en/guide/writing-middleware.html

//MiddleWare for ALL PRE Routes
//BodyParser.json Parse the Body of Incoming HTTP Request from Clients to JSON Format
//This means Our Server only expect JSON as Client Data
app.use(bodyParser.json());

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
//Routes for Users
app.use('/users',usersRouter);

//MIddleWare for ALL POST Routes
app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 4000;
//Starting API Server
app.listen(PORT, () => {
    console.log(`Node API Running On http://localhost:${PORT}`);
});

//Authentification : https://morioh.com/a/ae5f6016ec06/creez-des-api-dauthentification-des-utilisateurs-a-laide-de-nodejs-express-et-mysql
//Tutorial NODE : https://www.youtube.com/watch?v=Oe421EPjeBE
//TypeScript IS Better : https://github.com/ljlm0402/typescript-express-starter
