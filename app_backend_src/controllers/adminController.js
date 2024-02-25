//Controller for using Admin Router
//Callbacks of Admin Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL

//Import BCrypt for Password Hashing
//Import UserModel for Database Interactions
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel.js');
const dotenv = require('dotenv');
dotenv.config();

//@desc Get Users from database
//@route GET /admin/users
//@access public
const getUsers = async (req,res) => {
    //Querry all Users
    const users = await UserModel.findAll({
        order: [['last_name','ASC']],
        attributes: ['first_name','last_name','email']
    });

    //Check if somehow Users Undefined
    if(!users){
        res.status(500);
        throw new Error("Error : Something Happened");
    };
    
    res.status(200).send(`GET /admin/users on Admin API : Fetched Users : ${JSON.stringify(users, null, 2)}`);
};

//@desc Create and add User to database
//@route POST /admin/users
//@access public
const createUser = async (req,res) => {
    //Retreive Request Body data
    const formUser = {
        ...req.body
    };
    
    //Check all needed Fields are here
    if(!formUser.first_name || !formUser.last_name || !formUser.email || !formUser.password){
        res.status(400);
        throw new Error("Could not proceed : Missing Value");
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
        res.status(500);
        throw new Error("Error : Something Happened");
    };

    res.status(201).send(`POST /admin/users on Admin API : Created User with ID ${addedUser.id}`);
};

//@desc Get User with id from database
//@route GET /admin/users/:id
//@access public
const getUser = async (req,res) => {
    //Retreive Field id from req.params JSON Object
    const {id} = req.params;

    //Querry One User with id
    const user = await UserModel.findOne({
        where: {id: id},
        attributes: ['id','first_name','last_name','email','role']
    });

    //Check if User Found
    if(!user){
        res.status(404);
        throw new Error("Unregistered User");
    };

    res.status(200).send(`GET /admin/users/${id} on Admin API : Fetched User : ${JSON.stringify(user, null, 2)}`);
};

//@desc Update User with id in database
//@route PATCH /admin/users/:id
//@access public
const updateUser = async (req,res) => {
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
        res.status(404);
        throw new Error("Unregistered User");
    };

    //If Field Set, apply change
    if(first_name) user.first_name = first_name;
    if(last_name) user.last_name = last_name;
    if(email) user.email = email;

    //Apply Any Changes
    await user.save();

    res.status(200).send(`PATCH /admin/users/${id} on Admin API : Update Done`);
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

    res.status(200).send(`DELETE /admin/users/${id} on Admin API : Deleted User`);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
};
