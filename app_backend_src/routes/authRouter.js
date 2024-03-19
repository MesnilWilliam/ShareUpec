//Routes for Auth : http://localhost:PORT/auth
const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController.js');

/**
* @openapi
* '/auth/':
*  get:
*     tags:
*     - Auth Controller
*     summary: Redirect to Login Page
*     responses:
*      200:
*        description: Fetched Successfully
*/
authRouter.route('/').get(authController.getAuthRedirectLogin);

/**
* @openapi
* '/auth/login':
*  get:
*     tags:
*     - Auth Controller
*     summary: Login Page
*     responses:
*      200:
*        description: Fetched Successfully
*/
authRouter.route('/login').get(authController.getLoginForm);

/**
* @openapi
* '/auth/login':
*  post:
*     tags:
*     - Auth Controller
*     summary: Login User with email and password
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - email
*              - password
*            properties:
*              email:
*                type: string
*                default: undefined
*              password:
*                type: string
*                default: undefined
*     responses:
*      200:
*        description: Fetched Successfully
*/
authRouter.route('/login').post(authController.postLoginForm);

/**
* @openapi
* '/auth/logout':
*  post:
*     tags:
*     - Auth Controller
*     summary: Logout User
*     requestBody:
*      required: false
*      content:
*        application/json:
*           schema:
*            type: object
*     responses:
*      200:
*        description: Fetched Successfully
*/
authRouter.route('/logout').post(authController.postLogout);

/**
* @openapi
* '/auth/registration':
*  get:
*     tags:
*     - Auth Controller
*     summary: Registration Page
*     responses:
*      200:
*        description: Fetched Successfully
*/
authRouter.route('/registration').get(authController.getRegistrationForm);

/**
* @openapi
* '/auth/registration':
*  post:
*     tags:
*     - Auth Controller
*     summary: Registration User with minimal info
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - first_name
*              - last_name
*              - email
*              - password
*              - confirm_password
*            properties:
*              first_name:
*                type: string
*                default: undefined
*              last_name:
*                type: string
*                default: undefined
*              email:
*                type: string
*                default: undefined
*              password:
*                type: string
*                default: undefined
*              confirm_password:
*                type: string
*                default: undefined
*     responses:
*      201:
*        description: Created
*      400:
*        description: Bad Request
*      500:
*        description: Server Error
*/
authRouter.route('/registration').post(authController.postRegistrationForm);

module.exports = authRouter;
