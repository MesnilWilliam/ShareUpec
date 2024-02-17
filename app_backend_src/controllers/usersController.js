//Controller for using Users Router
//Callbacks of Users Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL

//Import BCrypt for Password Hashing
//Import UserModel for Database Interactions
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel.js');

//@desc Get users from database
//@route GET /users
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
    
    res.status(200).send(`GET /users on User API : Fetched Users : ${JSON.stringify(users, null, 2)}`);
};

//@desc Create and add user to database
//@route POST /users
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
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(formUser.password,saltRound);

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

    res.status(201).send(`POST /users on User API : Created User with ID ${addedUser.id}`);
};

//@desc Get user with id from database
//@route GET /users/:id
//@access public
const getUser = async (req,res) => {
    //Retreive Field id from req.params JSON Object
    const {id} = req.params;

    //Querry One User with id
    const user = await UserModel.findOne({
        where: {id: id},
        attributes: ['id','first_name','last_name','email']
    });

    //Check if User Found
    if(!user){
        res.status(404);
        throw new Error("Unregistered User");
    };

    res.status(200).send(`GET /users/${id} on User API : Fetched User : ${JSON.stringify(user, null, 2)}`);
};

//@desc Update user with id in database
//@route PATCH /users/:id
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

    res.status(200).send(`PATCH /users/${id} on User API : Update Done`);
};

//@desc Delete users with id from database
//@route DELETE /users/:id
//@access public
const deleteUser = async (req,res) => {
    //Retreive Field id from req.params JSON Object
    const {id} = req.params;

    //Remove One User with id
    await UserModel.destroy({
        where: {id: id}
    });

    res.status(200).send(`DELETE /users/${id} on User API : Deleted User`);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
};
