//Routes for Admin : http://localhost:PORT/admin
const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

//Get all Users
adminRouter.route('/users').get(authMiddleware.checkAdmin,adminController.getUsers);

//Add User
adminRouter.route('/users').post(authMiddleware.checkAdmin,adminController.createUser);

//Get User by ID
adminRouter.route('/users/:id').get(authMiddleware.checkAdmin,adminController.getUser);

//Update User by ID
adminRouter.route('/users/:id').patch(authMiddleware.checkAdmin,adminController.updateUser);

//Delete User by ID
adminRouter.route(`/users/:id`).delete(authMiddleware.checkAdmin,adminController.deleteUser);

module.exports = adminRouter;
