//Controller for using Dashboard Router
//Callbacks of Dashboard Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL
//req.user is defined as Passport Check for Authenticated User in Dashboard Routes

//Build Response JSON
const jsonBuilder = require('../utils/jsonBuilder.js');

//These Functions should all be On Routes to Authenticate User
//If User Authentication fails somewhere in App, They are taken to Login Page and Therefor Function defined Here are not Called
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel.js');
const parameterValidator = require('../utils/parameterValidator.js');

//These Functions should all be On Routes only accessed by Authenticated User
//If User Authentication cannont be established, They are taken to Login Page and Therefor Functions defined Here are not Called

//@desc Get Dashboard Home Page for Authenticated User in req.user
//@route GET /dashboard
//@access public
const getDashboard = (req,res) => {
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`Welcome, ${req.user.first_name}`);
    res.status(200).json(jsonResponse);
};

//@desc Get Profile Info for for Authenticated User in req.user
//@route GET /dashboard/profile
//@access public
const getProfile = (req,res) => {
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`UName: ${req.user.first_name} | ULastName: ${req.user.last_name} | UEmail: ${req.user.email}`);
    res.status(200).json(jsonResponse);
};

//@desc Update Logged User with id in database
//@route PATCH /dashboard/profile/update
//@access public
const updateLoggedUser = async (req,res,next) => {
    //Check UserID Numerical Value
    //Should be as User already Logged In
    if(!parameterValidator.isResolvableToNumber(req.user.id)){
        return next(CustomError.badRequest("Could not proceed : Invalid User ID"));
    }

    //Get potential Fields to Change
    const {first_name,last_name,email,password} = req.body;

    //Querry One User with id
    //As Update, Querry ALL Fields : Can be further secured
    const user = await UserModel.findOne({
        where: {id: req.user.id}
    });

    //Check if User Found
    //Should be as User already Logged In
    if(!user){
        return next(CustomError.serverError('Something Happened'));
    };

    //If Field Set, apply change
    if(first_name) user.first_name = first_name;
    if(last_name) user.last_name = last_name;
    if(parameterValidator.isEmailValid(email)) user.email = email;

    //Take and Hash Password
    if(password){
        const saltRounds = (process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10);
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        user.password = hashedPassword;
    }

    //Apply Any Changes
    await user.save();

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`PATCH /dashboard/profile/update on Dashboard API : Update Done`);
    res.status(200).json(jsonResponse);
};

//@desc Delete Logged User with id from database
//@route DELETE /dashboard/profile/delete
//@access public
const deleteLoggedUser = async (req,res) => {
    //Check UserID Numerical Value
    //Should be as User already Logged In
    if(!parameterValidator.isResolvableToNumber(req.user.id)){
        return next(CustomError.badRequest("Could not proceed : Invalid User ID"));
    }

    //Remove One User with id
    await UserModel.destroy({
        where: {id: req.user.id}
    });

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`DELETE /dashboard/profile/delete on Dashboard API : Deleted User`);
    res.status(204).json(jsonResponse);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getDashboard,
    getProfile,
    updateLoggedUser,
    deleteLoggedUser
};
