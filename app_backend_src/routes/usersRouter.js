//Routes for User : http://localhost:PORT/users
const express = require('express');
const usersRouter = express.Router();
const usersController = require('../controllers/usersController.js');

//Get all Users
usersRouter.route('/').get(usersController.getUsers);

//Add User
usersRouter.route('/').post(usersController.createUser);

//Get User by ID
usersRouter.route('/:id').get(usersController.getUser);

//Update User by ID
usersRouter.route('/:id').patch(usersController.updateUser);

//Delete User by ID
usersRouter.route(`/:id`).delete(usersController.deleteUser);

module.exports = usersRouter;
