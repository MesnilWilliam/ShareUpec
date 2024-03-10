//Routes for Auth : http://localhost:PORT/auth
const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController.js');

//Redirect to Login Page
authRouter.route('/').get(authController.getAuthRedirectLogin);

//Login Page
authRouter.route('/login').get(authController.getLoginForm);

//Login User
authRouter.route('/login').post(authController.postLoginForm);

//Logout User
authRouter.route('/logout').post(authController.postLogout);

//Registration Page
authRouter.route('/registration').get(authController.getRegistrationForm);

//Registration User
authRouter.route('/registration').post(authController.postRegistrationForm);

module.exports = authRouter;
