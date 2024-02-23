//Controller for using Authorisation Router
//Callbacks of Dashboard Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL
//req.user will be defined by Passport

//These Functions should all be On Routes to Authenticate User
//If User Authentication fails somewhere in App, They are taken to Login Page and Therefor Function defined Here for Login is Called
const passportSet = require('../config/passport-setup.js');

//@desc Get Redirected to Login Page for Authentication
//@route GET /auth
//@access public
const getAuthRedirectLogin = (req,res) => {
    //Login Form
    res.redirect('/auth/login');
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

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getAuthRedirectLogin,
    getLoginForm,
    postLoginForm,
    postLogout
};
