//Controller for using Authorisation Router
//Callbacks of Dashboard Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL
//req.user will be defined by Passport

//These Functions should all be On Routes to Authenticate User
//If User Authentication fails somewhere in App, They are taken to Login Page and Therefor Function defined Here for Login is Called
const CustomError = require('../config/CustomError.js');
const passportSet = require('../config/passport-setup.js');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel.js');

//@desc Get Redirected to Login Page for Authentication
//@route GET /auth
//@access public
const getAuthRedirectLogin = (req,res) => {
    //Login Form
    return res.redirect('/auth/login');
};

//@desc Get Login Form for Authentication
//@route GET /auth/login
//@access public
const getLoginForm = (req,res) => {
    //Display Login Form
    res.status(200).send("Please fill the login form");
};

//@desc Post Login Form Data and Try Authentication
//@route POST /auth/login
//@access public
const postLoginForm = (req,res,next) => {
    //Using Passport.authenticate in Controller
    //Solution from GIT Hub : https://github.com/swagger-api/swagger-node/issues/220
    //Solution from SO : https://stackoverflow.com/questions/50364757/how-to-use-passport-middleware-in-a-controller
    passportSet.authenticate('local',{
        successRedirect: '/dashboard/',
        failureRedirect: '/auth/login'
    })(req,res,next);
};

//@desc Post Logout : Browser usually make GET Request so POST protect from Basic Route Hijacking
//@route POST /auth/logout
//@access public
const postLogout = (req,res,next) => {
    //Logout with Passport
    //Passport add req.logout(Function) to Override Cookie on User Browser with dummy value thus invalidating the Session
    req.logout((err) => {
        if(err){
            return next(err);
        }
        res.redirect('/');
    });
}

//@desc Get Registration Form for New User
//@route GET /auth/registration
//@access public
const getRegistrationForm = (req,res) => {
    //Display Registration Form
    res.status(200).send("Please fill the registration form");
};

//@desc Post Registration Form Data and Try Creation of New User in Database
//@route POST /auth/registration
//@access public
const postRegistrationForm = async (req,res) => {
    //Retreive Request Body data
    const formUser = {
        ...req.body
    };
    
    //Check all needed Fields are here
    if(!formUser.first_name || !formUser.last_name || !formUser.email || !formUser.password){
        return next(CustomError.badRequest("Could not proceed : Missing Value"));
    };

    //Take and Hash Password
    const saltRounds = (process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10);
    const hashedPassword = await bcrypt.hash(formUser.password,saltRounds);

    //Only use Needed Fields to let AutoGen Fill ID and then some
    const addedUser = await UserModel.create({
        first_name: formUser.first_name,
        last_name: formUser.last_name,
        email: formUser.email,
        password: hashedPassword
    });

    //Check if somehow User Undefined
    if(!addedUser){
        next(CustomError.serverError("Error : Something Happened"));
    };

    res.status(201).send(`POST auth/registration : Created User with ID ${addedUser.id}`);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getAuthRedirectLogin,
    getLoginForm,
    postLoginForm,
    postLogout,
    getRegistrationForm,
    postRegistrationForm
};
