//Controller for using Admin Router
//Callbacks of Admin Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL

//Build Response JSON
const jsonBuilder = require('../utils/jsonBuilder.js');

//Import BCrypt for Password Hashing
//Import UserModel for Database Interactions
const CustomError = require('../config/CustomError.js');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel.js');
const dotenv = require('dotenv');
dotenv.config();

//@desc Get Users from database
//@route GET /admin/users
//@access public
const getUsers = async (req,res,next) => {
    //Querry all Users
    const users = await UserModel.findAll({
        order: [['last_name','ASC']],
        attributes: ['first_name','last_name','email']
    });

    //Check if somehow Users Undefined
    if(!users){
        return next(CustomError.serverError('Something Happened'));
    };
    
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(users, null, 2));
    res.status(200).json(jsonResponse);
};

//@desc Create and add User to database
//@route POST /admin/users
//@access public
const createUser = async (req,res,next) => {
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
        return next(CustomError.serverError("Error : Something Happened"));
    };

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`POST /admin/users on Admin API : Created User with ID ${addedUser.id}`);
    res.status(201).json(jsonResponse);
};

//@desc Get User with id from database
//@route GET /admin/users/:id
//@access public
const getUser = async (req,res,next) => {
    //Retreive Field id from req.params JSON Object
    const {id} = req.params;

    //Querry One User with id
    const user = await UserModel.findOne({
        where: {id: id},
        attributes: ['id','first_name','last_name','email','role']
    });

    //Check if User Found
    if(!user){
        return next(CustomError.notFound("Unregistered User"));
    };

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(user, null, 2));
    res.status(200).json(jsonResponse);
};

//@desc Update User with id in database
//@route PATCH /admin/users/:id
//@access public
const updateUser = async (req,res,next) => {
    //Retreive Field id from req.params JSON Object
    const {id} = req.params;

    //Get potential Fields to Change
    const {first_name,last_name,email} = req.body;

    //Querry One User with id
    //As Update, Querry ALL Fields : Can be further secured
    const user = await UserModel.findOne({
        where: {id: id}
    });

    //Check if User Found
    if(!user){
        return next(CustomError.notFound("Unregistered User"));
    };

    //If Field Set, apply change
    if(first_name) user.first_name = first_name;
    if(last_name) user.last_name = last_name;
    if(email) user.email = email;

    //Apply Any Changes
    await user.save();

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`PATCH /admin/users/${id} on Admin API : Update Done`);
    res.status(200).json(jsonResponse);
};

//@desc Delete User with id from database
//@route DELETE /admin/users/:id
//@access public
const deleteUser = async (req,res) => {
    //Retreive Field id from req.params JSON Object
    const {id} = req.params;

    //Remove One User with id
    await UserModel.destroy({
        where: {id: id}
    });

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`DELETE /admin/users/${id} on Admin API : Deleted User`);
    res.status(204).json(jsonResponse);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
};
